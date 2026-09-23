import httpx

candidates = {
    'IBM Deep Learning': 'https://images.credly.com/images/973d7ca2-c74e-4f2c-8be8-80b32bbe18f3/Coursera_20IBM_20Deep_20Learning_20with_20PyTorch_20Keras_20and_20Tensorflow_20Prof_20Cert.png',
    'DeepLearning.AI TF': 'https://images.credly.com/images/4294b05a-83b6-4552-870f-c30fd712ea4c/Tensorflow_20Developer.png',
    'IBM ML': 'https://images.credly.com/images/d4f5ad79-2eea-4c8b-802d-efc2b6504879/image.png',
    'IBM RAG': 'https://images.credly.com/images/b2a81c72-1b87-403e-8357-e33bc87b496b/linkedin_thumb_IBM_20RAG_20and_20Agentic_20AI_20Professional_20Certificate.png',
    'IBM Agents': 'https://images.credly.com/images/8726b827-d9e5-47a2-a84c-91ca077c6594/image.png',
    'IBM AI Dev': 'https://images.credly.com/images/70675aed-31be-4c30-add7-b99905a34005/image.png',
    'AWS Bedrock': 'https://images.credly.com/images/b9feab85-1a43-4f6c-99a5-631b88d5461b/image.png',
    'IBM AI Eng': 'https://images.credly.com/images/e6f51001-ef22-4ad5-91e4-f9d577fe5a2e/blob',
    'IBM Data Sci': 'https://images.credly.com/images/42ce4209-8839-431a-9046-f2ce2e72e04b/Coursera_20Data_20Science_20Professional_20Certificate.png',
    'IBM GenAI Eng': 'https://images.credly.com/images/7c767766-0960-4cc1-8d95-23cb8844d981/image.png',
    'Google AI': 'https://images.credly.com/images/d6521452-e64b-4f96-bc20-4758b720757b/blob',
    'IBM Data Sci Found': 'https://images.credly.com/images/169512d3-cef6-43e3-bec8-e6af2723a076/image.png'
}

for k, v in candidates.items():
    try:
        r = httpx.get(v, follow_redirects=True, timeout=5.0)
        ctype = r.headers.get("content-type", "")
        print(f"{k}: {r.status_code} ({ctype})")
    except Exception as e:
        print(f"{k}: ERROR {e}")
