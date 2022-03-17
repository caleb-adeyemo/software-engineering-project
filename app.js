// imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 4000;

// Static Files
app.use(express.static("public"));
app.use("/dist", express.static(__dirname + "public/dist"));
app.use("/js", express.static(__dirname + "public/js"));
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views | Templating Engine
app.use(expressLayouts);
app.set("layout", "./pages/home");
app.set("view engine", "ejs");

// Navigation | Route
app.get("", (req, res) => {
	res.render("index", { title: "Home" });
});

// Listen on port 8000
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm install ejs express express-ejs-layouts
// npm start
