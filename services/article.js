const cheerio = require("cheerio");
const config = require("../config/config.json");

module.exports = {
    buildArticleFromElement: function(element) {
        let $ = cheerio.load(element);

        return {
            title: $(element)
                .children("a")
                .children(".media-body")
                .children(".media-title")
                .text(),
            description: $(element)
                .children("a")
                .children(".media-body")
                .children(".media-deck")
                .text(),
            link:
                config.gamespotUrl +
                $(element)
                    .children("a")
                    .attr("href"),
            posted: new Date(
                $(element)
                    .children("a")
                    .children(".media-body")
                    .children(".media-meta")
                    .children("time")
                    .attr("datetime")
            ),
            image: $(element)
                .children("a")
                .children("figure")
                .children(".media-img")
                .children("img")
                .attr("src")
        };
    }
};
