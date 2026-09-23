import httpx, re

try:
    r = httpx.get('https://certnexus.com/certification/certified-data-science-practitioner-cdsp/', follow_redirects=True, timeout=10.0)
    imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:png|jpg|svg)', r.text, re.IGNORECASE)
    for img in set(imgs):
        if any(x in img.lower() for x in ['badge', 'cdsp', 'dsp', 'cert']):
            print(img)
except Exception as e:
    print('Error:', e)
