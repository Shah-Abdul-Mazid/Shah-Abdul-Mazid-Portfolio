import json
try:
    from pymongo import MongoClient
except ImportError:
    print("pymongo not installed, trying standard library fallback...")
    import sys
    sys.exit(1)

def main():
    uri = "mongodb+srv://shahabdulmazid:vvQzy1ZXSoUL8f4T@portfolio.2wfq0v1.mongodb.net/?appName=Portfolio"
    client = MongoClient(uri)
    try:
        db = client["portfolio_data"]
        doc = db["portfolio_content"].find_one({"key": "main"})
        if doc:
            data = doc.get("data", {})
            projects = data.get("projects", [])
            print(f"Number of projects: {len(projects)}")
            print("PROJECTS_DATA_START")
            print(json.dumps(projects, default=str, indent=2))
            print("PROJECTS_DATA_END")
        else:
            print("No main document found!")
    except Exception as e:
        print("Error:", e)
    finally:
        client.close()

if __name__ == "__main__":
    main()
