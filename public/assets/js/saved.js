function initializePage() {
    //Initialize the page with any articles already in the db
    renderArticles();
}

function renderArticles() {
    //Render the articles to #articles
    $.get("/api/articles?saved=true").then(articles => {
        let $articles = $("#savedArticles");
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
                        .addClass("btn btn-primary add-note float-right")
                        .html("Comments")
                        .data("id", article._id)
                )
                .append(
                    $("<button>")
                        .addClass("btn btn-danger delete-article float-right mr-2")
                        .html("Remove from Saved")
                        .data("id", article._id)
                )
        );
    return $article;
}

function showCommentModal() {
    let articleId = $(this).data().id;
    getComments(articleId, comments => {
        renderComments(comments, articleId);
        $("#save-comment-btn").data("id", articleId);
        $("#comments-modal").modal("show");
    });
}

function renderComments(comments, articleId) {
    let $comments = $("#comments");
    $comments.empty();

    if (comments.length === 0) {
        $comments.append("No comments found.");
    } else {
        comments.forEach(comment => {
            $comments.append(buildCommentElement(comment, articleId));
        });
    }
}

function buildCommentElement(comment, articleId) {
    return $("<p>")
        .html(comment.text)
        .append(
            $("<btn>")
                .addClass("delete-comment-btn btn float-right")
                .data("commentId", comment._id)
                .data("articleId", articleId)
                .html("&times;")
        );
}

function getComments(articleId, callback) {
    $.get(`/api/article/${articleId}/comments`).then(comments => {
        callback(comments);
    });
}

function saveComment(event) {
    event.preventDefault();
    let articleId = $(this).data().id;
    let $comment = $("#comment");
    let comment = {
        text: $comment.val().trim()
    };
    $.post(`/api/article/${articleId}/saveComment`, comment).then(result => {
        getComments(result._id, comments => renderComments(comments, articleId));
        $comment.val("");
    });
}

function deleteComment() {
    let data = $(this).data();
    $.post(`/api/article/${data.articleId}/deleteComment/${data.commentId}`).then(response => {
        console.log(response);
        getComments(data.articleId, comments => renderComments(comments, data.articleId));
    });
}

function deleteArticle() {
    let articleId = $(this).data().id;
    $.post(`/api/article/${articleId}/unsave`).then(result => {
        if (!result.saved) {
            initializePage();
        }
    });
}

$(document).on("click", ".add-note", showCommentModal);
$(document).on("click", ".delete-comment-btn", deleteComment);
$(document).on("click", ".delete-article", deleteArticle);
$("#save-comment-btn").on("click", saveComment);

initializePage();
