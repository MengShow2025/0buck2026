type StorageLike = Pick<Storage, 'removeItem'>;

const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'token'] as const;

export function clearStoredAuthTokens(storage: StorageLike): void {
  AUTH_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
