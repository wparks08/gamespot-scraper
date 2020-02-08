const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));

// Initialize handlebars
const hbrsOptions = {
    defaultLayout: "main"
};

app.engine("handlebars", exphbs(hbrsOptions));
app.set("view engine", "handlebars");

// Routes

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
});