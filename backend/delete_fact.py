from app.db.session import SessionLocal
from app.models.butler import UserMemoryFact

db = SessionLocal()
db.query(UserMemoryFact).filter(UserMemoryFact.key.like('%dark_mode%')).delete()
db.commit()
print("Done")
