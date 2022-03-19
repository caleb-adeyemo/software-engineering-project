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
app.set("layout", "./pages/_landing");
app.set("view engine", "ejs");

// Navigation | Route
app.get("", (req, res) => {
	res.render("landing", { title: "MySpace - Home" });
});
app.get('/login', (req, res) => {
  res.render('login', { layout: './pages/_login', title: 'Login' })
});
app.get('/signup', (req, res) => {
  res.render('signup', { layout: './pages/_signup', title: 'Sign Up' })
});
app.get('/myAccount', (req, res) => {
  res.render('myAccount', { layout: './pages/_myAccount', title: 'My Account' })
});

// Listen on port 8000
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm start
