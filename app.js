// imports
import express from 'express';
import expressLayouts  from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import * as util from './src/js/dbms.js';
import * as server from './src/js/server.js';
import * as RESRV from './src/js/reservation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;
let urlEncodedParser = bodyParser.urlencoded({extended: false});
const USER_TABLE_PATH = 'users.json';
const SPACE_DB_PATH = 'spaces.json';
let user_table = null;
let space_db = null;

// initialise databases
let result = util.load_from_file(USER_TABLE_PATH);
if(result.code === util.OK){
   user_table = result.unwrap;  
}else{
   console.log('creating new table from scratch');
   user_table = util.Table(USER_TABLE_PATH);
}

let space_db_file = util.load_space_db(SPACE_DB_PATH);
if(!space_db_file){
   space_db = server.init_server_db();
}else{
   space_db = util.deserialise_space_db(space_db_file);
}
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
app.get('/admin', (req, res) => {
   res.render('admin', { layout: './pages/_admin', title: 'Admin' })
 });

app.post('/login',urlEncodedParser,(req,res)=>{
   console.log("--email--");
   console.log(req.body.email); 
   console.log("--password--");
   console.log(req.body.password);
   let result = server.handle_login(user_table,req.body.email,req.body.password); 
   res.send(result.msg);
});

app.post('/signup',urlEncodedParser,(req,res)=>{
   console.log("--email--");
   console.log(req.body.email); 
   console.log("--password--");
   console.log(req.body.password);
   let result = server.handle_signup(
      user_table,
      req.body.username,
      req.body.name,
      req.body.email,
      req.body.password
   );
   res.send(result.msg);
});

app.post('/admin',urlEncodedParser,(req,res)=>{
   let result = server.post_reservations(req,space_db);
   res.send(JSON.Stringify(result));
});

app.patch('/admin',urlEncodedParser,(req,res)=>{
   let result = server.patch_space_db_with_new_reservation(space_db,req);
   if(result.code === RESRV.RES_OK){
      res.send(JSON.Stringify(result.unwrap));
       
   }else{
      let err = {};
      err.KEY = null;
      err.msg = result.msg;
      res.send(JSON.Stringify(err));
   }
});
// Listen on port 8000
const app_server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm start
