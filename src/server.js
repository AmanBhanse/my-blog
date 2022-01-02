import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb"; //Tool to connect to our local database

const MONGO_DB_URL = "mongodb://127.0.0.1:27017";
const MONGO_DB_NAME = "my-blog-db";
const COLLECTION_NAME = "articles";

const app = express();

app.use(bodyParser.json());

const withDB = async (operations, res) => {
    try {
        const client = new MongoClient(MONGO_DB_URL);
        await client.connect();
        const db = client.db(MONGO_DB_NAME);
        await operations(db);
        client.close();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Connecting to DB",
            error,
        });
    }
};

app.get("/api/articles/:name", async (req, res) => {
    await withDB(async (db) => {
        const articleName = req.params.name;
        const articlesInfo = await db.collection(COLLECTION_NAME).findOne({ name: articleName });
        res.status(200).json(articlesInfo);
    }, res);
});

app.post("/api/articles/:name/upvote", async (req, res) => {
    await withDB(async (db) => {
        const articleName = req.params.name;
        const articlesInfo = await db.collection("articles").findOne({ name: articleName });
        await db.collection("articles").updateOne(
            { name: articleName },
            {
                $set: {
                    upvotes: articlesInfo.upvotes + 1,
                },
            }
        );
        const updatedArticlesInfo = await db.collection("articles").findOne({ name: articleName });
        res.status(200).json(updatedArticlesInfo);
    }, res);
});

app.post("/api/articles/:name/add-comment", (req, res) => {
    const { userName, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ userName, text });
    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log("Listening on port 8000"));
