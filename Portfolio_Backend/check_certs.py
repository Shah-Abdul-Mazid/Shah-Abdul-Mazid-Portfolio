import pymongo

client = pymongo.MongoClient('mongodb+srv://shahabdulmazid:vvQzy1ZXSoUL8f4T@portfolio.2wfq0v1.mongodb.net/?appName=Portfolio')
db = client['portfolio_data']
doc = db['portfolio_content'].find_one({'key': 'main'})
certs = doc.get('data', {}).get('certifications', [])
print(f"Total certs in DB: {len(certs)}")
for i, c in enumerate(certs):
    print(f"[{i}] {c.get('name')} | {c.get('issuer')} | badge: {c.get('badgeUrl')}")
