// imports
import express from 'express';
import expressLayouts  from 'express-ejs-layouts';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;

// Static Files
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "src/js"));
app.use('/img', express.static(__dirname + 'src/img'))

// Set Views | Templating Engine
app.use(expressLayouts);
app.set("layout", "./pages/home");
app.set("view engine", "ejs");

// Navigation | Route
app.get("", (req, res) => {
	res.render("index", { title: "MySpace - Home" });
});

// Listen on port 8000
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm install ejs express express-ejs-layouts
// npm start
