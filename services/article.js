module.exports = {
    buildArticleFromElement: function(element) {
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
                gamespotUrl +
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
            )
        };
    }
};
