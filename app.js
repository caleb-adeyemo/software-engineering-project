// imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 8000;

// Static Files
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "src/js"));
app.use("/img", express.static(__dirname + "src/img"));

// Set Views | Templating Engine
app.use(expressLayouts);
app.set("layout", "./pages/home");
app.set("view engine", "ejs");

// Navigation | Route
app.get("", (req, res) => {
	res.render("index", { title: "MySpace - Home" });
});

// Listen on port 8000
const server = app.listen(port, () =>
	console.log(`Listening at http://localhost:${port}`)
);

// npm install ejs express express-ejs-layouts
// npm start
