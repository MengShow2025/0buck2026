import sys
import os

# Add backend dir to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import engine
from app.models.ledger import Base

def init_all():
    print("Creating all missing tables...")
    Base.metadata.create_all(bind=engine)
    print("Check finished.")

if __name__ == "__main__":
    init_all()
