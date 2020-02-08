const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");
const articleService = require("../services/article");
const gamespotUrl = "https://www.gamespot.com";

module.exports = function(app) {
    app.get("/api/scrape", (req, res) => {
        axios.get(gamespotUrl).then(response => {
            let $ = cheerio.load(response.data);
            let articles = [];

            $("article").each((index, element) => {
                let newArticle = articleService.buildArticleFromElement(element);
                articles.push(newArticle);
                db.article
                    .create(newArticle)
                    .then(() => {
                        console.log(newArticle);
                    })
                    .catch(err => {
                        if (err.code === 11000) {
                            // E11000 duplicate key error
                            console.error("Skipping duplicate article");
                        } else {
                            console.error(err);
                        }
                    });
            });
            res.send(200);
        });
    });

    app.get("/api/articles", (req, res) => {
        db.article
            .find({})
            .then(articles => {
                res.json(articles);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/api/article/:id", (req, res) => {
        db.article
            .findOne({ _id: req.params.id })
            // .populate("comment")
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/api/article/:id/saveNote", (req, res) => {
        db.comment
            .create({ text: req.body.text })
            .then(comment => {
                return db.article.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { comments: comment._id } },
                    { new: true }
                );
            })
            .then(article => {
                res.json(article);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/api/article/:id/save", (req, res) => {
        db.article
            .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true })
            .then(article => {
                res.json(article);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
