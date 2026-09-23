import pymongo

client = pymongo.MongoClient('mongodb+srv://shahabdulmazid:vvQzy1ZXSoUL8f4T@portfolio.2wfq0v1.mongodb.net/?appName=Portfolio')
db = client['portfolio_data']
doc = db['portfolio_content'].find_one({'key': 'main'})

if not doc or 'data' not in doc:
    print("Could not find portfolio_content document.")
    exit(1)

data = doc['data']
certs = data.get('certifications', [])
updated_count = 0

badge_map = {
    # 1. Google AI -> Google AI Fundamentals
    'google ai': 'https://images.credly.com/images/d6521452-e64b-4f96-bc20-4758b720757b/linkedin_thumb_blob',
    # 2. IBM AI Engineering -> AI Essentials V2 (676e65a6-de2b-481b-a559-610a6f7417fb)
    'ibm ai engineering': 'https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/linkedin_thumb_Coursera_20Artificial_20Intelligence_20Essentials_20V2.png',
    # 3. IBM Data Science -> IBM Data Science Professional Certificate (V3)
    'ibm data science': 'https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/linkedin_thumb_Coursera_20Data_20Science_20Professional_20Certificate.png',
    # 4. RAG for Generative AI Applications -> Generative AI Essentials for Data Science
    'rag for generative ai applications': 'https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/linkedin_thumb_image.png',
    # 5. IBM Generative AI Engineering -> Generative AI Essentials for Data Science
    'ibm generative ai engineering': 'https://images.credly.com/images/1dc40257-c856-4e6b-9a92-29be936a9e7c/linkedin_thumb_image.png',
}

for cert in certs:
    name_clean = cert.get('name', '').strip().lower()
    for key, url in badge_map.items():
        if key in name_clean or name_clean == key:
            # Special check to distinguish "ibm ai engineering" vs "ibm generative ai engineering"
            if key == 'ibm ai engineering' and 'generative' in name_clean:
                continue
            cert['badgeUrl'] = url
            print(f"Updated '{cert.get('name')}' with badgeUrl: {url[:60]}...")
            updated_count += 1
            break

db['portfolio_content'].update_one(
    {'key': 'main'},
    {'$set': {'data.certifications': certs}}
)

print(f"Successfully updated {updated_count} certifications in MongoDB!")
