import base64
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from .config import settings

# Use the master key from settings, ensure it is 32 bytes for AES-256
MASTER_KEY = settings.MASTER_SECRET_KEY.encode().ljust(32, b'\0')[:32]

def encrypt_api_key(raw_key: str) -> str:
    """Encrypts a raw API key using AES-256-CBC."""
    if not raw_key:
        return ""
    
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(MASTER_KEY), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(raw_key.encode()) + padder.finalize()
    
    encrypted = encryptor.update(padded_data) + encryptor.finalize()
    
    # Return IV + Encrypted data as base64
    return base64.b64encode(iv + encrypted).decode('utf-8')

def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypts an encrypted API key."""
    if not encrypted_key:
        return ""
    
    try:
        data = base64.b64decode(encrypted_key)
        iv = data[:16]
        encrypted_content = data[16:]
        
        cipher = Cipher(algorithms.AES(MASTER_KEY), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        
        decrypted_padded = decryptor.update(encrypted_content) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()
        
        return decrypted.decode('utf-8')
    except Exception:
        # If decryption fails, it might be unencrypted or wrong key
        return ""
