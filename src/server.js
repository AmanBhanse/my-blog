import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const articlesInfo = {
    "learn-react": {
        upvotes: 0,
    },
    "learn-node": {
        upvotes: 0,
    },
};

app.post("/api/articles/:name/upvote", (req, res) => {
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
});

app.listen(8000, () => console.log("Listening on port 8000"));
