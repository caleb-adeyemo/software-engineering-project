// imports
import express, { json } from 'express';
import expressLayouts  from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import process from 'node:process';

import * as util from './src/js/dbms.js';
import * as server from './src/js/server.js';
import * as RESRV from './src/js/reservation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;
let urlEncodedParser = bodyParser.urlencoded({extended: true});
let jsonParser = bodyParser.json();
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
app.use(urlEncodedParser);
app.use(jsonParser);
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

app.post('/myAccount',jsonParser,(req,res)=>{
   let result = server.post_user_reservations(req.body.email); 
   if(server.user_has_reservations(result)){
      res.send(JSON.stringify(result));
   }else{
      let null_obj = {};
      res.send(null_obj);
   }
});

app.post('/admin',jsonParser,(req,res)=>{
   //console.log(req);
   console.log(req.body);
   let result = server.post_reservations(req.body,space_db);
   res.send(JSON.stringify(result));
});

app.patch('/admin',jsonParser,(req,res)=>{
   let result = server.patch_space_db_with_new_reservation(space_db,req.body);
   if(result.code === RESRV.RES_OK){
      res.send(JSON.stringify(result.unwrap));
       
   }else{
      let err = {};
      err.KEY = null;
      err.msg = result.msg;
      res.send(JSON.stringify(err));
   }
});
// Listen on port 8000
const app_server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
function save_state_before_exit(){
   console.log("==== saving data before exit ===");
   let db_data = util.serialise_space_db(space_db);
   util.save_space_db(SPACE_DB_PATH,db_data);

   let user_data = user_table.serialise();
   user_table.save_to_file(user_data);
   process.exit();
}
process.stdin.resume();
process.on('SIGINT',(_code) =>{
   console.log("before sigint");
   console.log(_code);
   save_state_before_exit();
});
process.on('beforeExit',(_code) =>{
   console.log("on before exit");
   console.log(_code);
   save_state_before_exit();
});
// npm start
