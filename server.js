const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const middleware = require("./routes/middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/gamespot-scraper";

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));
app.use(middleware.setActiveNavbarLink);

// Initialize handlebars
const hbrsOptions = {
    defaultLayout: "main"
};

app.engine("handlebars", exphbs(hbrsOptions));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
