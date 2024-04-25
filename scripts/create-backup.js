const path = require("path");
const fs = require("fs/promises");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);

async function run(outputDir) {
    try {
        const database = client.db('test');
        const issues = await database.collection('issues').find().toArray();
        await fs.writeFile(path.join(outputDir, "issues.json"), JSON.stringify(issues));
    } finally {
        await client.close();
    }
}

run(process.argv[2])
    .then(_ => console.log("Done!"))
    .catch(err => console.error(err));