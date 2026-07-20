const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://shahabdulmazid:vvQzy1ZXSoUL8f4T@portfolio.2wfq0v1.mongodb.net/?appName=Portfolio";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("portfolio_data");
        const doc = await db.collection("portfolio_content").findOne({ "key": "main" });
        if (doc) {
            console.log("Found main document");
            const data = doc.data || {};
            const projects = data.projects || [];
            console.log(`Number of projects: ${projects.length}`);
            console.log("PROJECTS_DATA_START");
            console.log(JSON.stringify(projects, null, 2));
            console.log("PROJECTS_DATA_END");
        } else {
            console.log("No main document found!");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();
