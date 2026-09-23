import httpx, re

badges = [
    ("Google AI Fundamentals", "https://www.credly.com/badges/d172156c-c193-4172-9c79-829d14b9d93e/public_url"),
    ("Google AI for Brainstorming and Planning", "https://www.credly.com/badges/a257e2c0-3b13-4d63-aa31-1a2d358c4f99/public_url"),
    ("IBM Data Science Professional Certificate", "https://www.credly.com/badges/6a8e7540-1d98-455d-af07-2559ed272e3b/public_url"),
    ("Databases and SQL for Data Science", "https://www.credly.com/badges/dc581941-4adf-4d13-9672-5c7b5902b056/public_url"),
    ("Data Visualization with Python", "https://www.credly.com/badges/cd320125-d418-4a23-883e-845afef9c6d9/public_url"),
    ("Generative AI Essentials for Data Science", "https://www.credly.com/badges/a6f34c20-aa81-43c2-be32-680ad03dbf9e/public_url"),
    ("Applied Data Science Capstone", "https://www.credly.com/badges/56cc091b-a87c-4af4-8d23-8ea151100c3e/public_url"),
    ("Data Scientist Career Guide", "https://www.credly.com/badges/439040fd-48ae-47f7-87b1-bf7158c73659/public_url"),
    ("Artificial Intelligence Essentials V2", "https://www.credly.com/badges/676e65a6-de2b-481b-a559-610a6f7417fb/public_url")
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

results = []

for name, url in badges:
    try:
        r = httpx.get(url, headers=headers, follow_redirects=True, timeout=10.0)
        # Search for og:image
        m = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', r.text, re.IGNORECASE)
        if not m:
            m = re.search(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', r.text, re.IGNORECASE)
        img = m.group(1) if m else "NOT_FOUND"
        print(f"[{name}]\n  Page: {url}\n  Image: {img}\n")
        results.append((name, url, img))
    except Exception as e:
        print(f"Error {name}: {e}")
