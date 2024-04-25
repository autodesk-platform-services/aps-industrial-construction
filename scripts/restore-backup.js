const path = require("path");
const fs = require("fs/promises");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);

async function run(backupDir) {
    try {
        const database = client.db('test');

        const issues = JSON.parse(await fs.readFile(path.join(backupDir, "issues.json")));
        for (const issue of issues) {
            delete issue._id;
            delete issue.__v;
        }
        await database.collection('issues').insertMany(issues);
    } finally {
        await client.close();
    }
}

run(process.argv[2])
    .then(_ => console.log("Done!"))
    .catch(err => console.error(err));