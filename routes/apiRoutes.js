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
            res.sendStatus(200);
        });
    });

    app.get("/api/articles", (req, res) => {
        let options = {
            saved: false
        };
        if (req.query.saved === "true") {
            options.saved = true;
        }
        db.article
            .find(options)
            .sort({ posted: "desc" })
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
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/api/article/:id/comments", (req, res) => {
        db.article
            .findOne({ _id: req.params.id })
            .populate("comments")
            .then(result => {
                res.json(result.comments);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/api/article/:id/saveComment", (req, res) => {
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

    app.post("/api/article/:articleId/deleteComment/:commentId", (req, res) => {
        db.article
            .findOneAndUpdate({ _id: req.params.articleId }, { $pull: { comments: { _id: req.params.commentId } } })
            .then(() => {
                return db.comment.findOneAndDelete({ _id: req.params.commentId });
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/api/article/:id/unsave", (req, res) => {
        db.article
            .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } }, { new: true })
            .then(article => {
                res.json(article);
            })
            .catch(err => {
                res.json(err);
            });
    })
};
