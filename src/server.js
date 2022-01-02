import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb"; //Tool to connect to our local database

const MONGO_DB_URL = "mongodb://127.0.0.1:27017";
const MONGO_DB_NAME = "my-blog-db";

const app = express();

app.use(bodyParser.json());

app.get("/api/articles/:name", async (req, res) => {
    try {
        const articleName = req.params.name;
        const client = new MongoClient(MONGO_DB_URL);
        await client.connect();
        const db = client.db(MONGO_DB_NAME);
        const articlesInfo = await db.collection("articles").findOne({ name: articleName });
        res.status(200).json(articlesInfo);
        client.close();
    } catch (error) {
        res.status(500).json({
            message: "Error Connecting to DB",
            error,
        });
    }
});

app.post("/api/articles/:name/upvote", (req, res) => {
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
});

app.post("/api/articles/:name/add-comment", (req, res) => {
    const { userName, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ userName, text });
    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log("Listening on port 8000"));
