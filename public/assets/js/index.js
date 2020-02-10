function initializePage() {
    //Initialize the page with any articles already in the db
    renderArticles();
}

function scrapeArticles() {
    //tie to button - call api to scrape articles
    $.get("/api/scrape").then(result => {
        console.log(result);
        if (result === "OK") {
            $("#scrapeBtn")
                .removeClass("btn-warning")
                .addClass("btn-success");
        }
        renderArticles();
    });
    //after scrape is complete, render articles
}

function renderArticles() {
    //Render the articles to #articles
    $.get("/api/articles?saved=false").then(articles => {
        let $articles = $("#articles");
        $articles.empty();
        articles.forEach(article => {
            $articles.append(buildArticleElement(article));
        });
    });
}

function buildArticleElement(article) {
    //create and return the article element
    let $article = $("<div>")
        .addClass("media mb-3")
        .append(
            $("<img>")
                .attr("src", article.image)
                .addClass("mr-3 align-self-center")
        )
        .append(
            $("<div>")
                .addClass("media-body")
                .append(
                    $("<a>")
                        .attr("href", article.link)
                        .attr("target", "_blank")
                        .append(
                            $("<h5>")
                                .addClass("mt-0")
                                .html(article.title)
                        )
                )
                .append(`<p>${article.description}</p>`)
                .append(
                    $("<span>")
                        .addClass("text-secondary")
                        .html(`Posted on: ${new Date(article.posted).toLocaleDateString()}`)
                )
                .append(
                    $("<button>")
                        .addClass("btn btn-success save-article float-right")
                        .html("Save Article")
                        .data("id", article._id)
                )
        );
    return $article;
}

function saveArticle() {
    let id = $(this).data().id;
    //post to api to save article
    $.post(`/api/article/${id}/save`).then(result => {
        if (result.saved) {
            initializePage();
        }
    });
}

$("#scrapeBtn").on("click", function() {
    $("#scrapeBtn")
        .removeClass("btn-primary")
        .addClass("btn-warning");
    scrapeArticles();
});

$(document).on("click", ".save-article", saveArticle);

initializePage();
