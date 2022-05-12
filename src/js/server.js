import *  as util from './dbms.js';
import * as USR from './user.js';
import * as SPACE from './space.js';
import * as RESRV from './reservation.js';

const LIBRARY = 'LIBRARY';
const SU = 'SU';
const VILLAGE = 'VILLAGE';
const SPORTSPARK = 'SPORTSPARK';
const NEW_SCI = 'NEW_SCI';
const INTO = 'INTO';
const SAINSBURY = 'SAINSBURY';


export function init_server_db(){
   let lot_map = new Map();
   lot_map.put(LIBRARY,SPACE.init_lot(1,10));
   lot_map.put(SU,SPACE.init_lot(1,10));
   lot_map.put(VILLAGE,SPACE.init_lot(1,10));
   lot_map.put(SPORTSPARK,SPACE.init_lot(1,10));
   lot_map.put(NEW_SCI,SPACE.init_lot(1,10));
   lot_map.put(INTO,SPACE.init_lot(1,10));
   lot_map.put(SAINSBURY,SPACE.init_lot(1,10));
   
   return lot_map; 
}
function filter_year(resrv_list,year){
   return resrv_list.filter(res => res.time.start.getYear() === year);
}
function filter_month(resrv_list,month){
   return resrv_list.filter(res => res.time.start.getMonth() === month);
}
function filter_day(resrv_list,day){
   return resrv_list.filter(res => res.time.start.getDay() === day);
}
function filter_hour(resrv_list,hr){
   return resrv_list.filter(res => res.time.start.getHours() === hr);
}

export function init_server_queries(){
   let query_map = new Map();
   query_map.put('SELECT * WHERE YEAR',filter_year);
   query_map.put('SELECT * WHERE MONTH',filter_month);
   query_map.put('SELECT * WHERE DAY',filter_day);
   query_map.put('SELECT * WHERE HOUR',filter_hour);
   return query_map;
}

//maps a list of spaces into reservations that pass a predicate
export function get_reservations(spaces_list,predicate){
   let resrv_list = spaces_list.map(space => space.reservations);
   let result = [];
   //console.log(resrv_list);
   for(let i = 0; i < resrv_list.length; i++){
      let matches = resrv_list[i].filter(predicate);
      if(matches){
         result.push(matches);
      }
   }
   return result.flat();
}

export function get_reservations_map(spaces_list,predicate){
   let pair_array = {};
   spaces_list.forEach(
      space =>{
         let match_arr = space.reservations.filter(predicate);
         pair_array[space.key()] = match_arr;
      }
   );
   return pair_array;
}

export function reservation_map_to_summary_map(resrv_map){
   let sum_map = {};
   for (const [key,value] of Object.entries(resrv_map)){
      sum_map[key] = value.map( val => RESRV.summary(val));
   }
   return sum_map;   
}

export function find_user_by_email(table,email){
   let user = table.get(email);
   if(user){
      return util.Result(util.OK,"user was found",user);
   }
   return util.Result(util.NONE,"user account does not exist",null);
}
export function passwords_match(password0,password1){
   return password0 === password1;  
}

export function handle_login(table,email,password){
   const result = find_user_by_email(table,email);
   if(result.code === util.NONE){
      return util.Result(util.ERR,'invalid account',false);
   }

   let cur_user = result.unwrap; 

   if(result.code === util.OK && passwords_match(password,cur_user.password)){
      return util.Result(util.OK,'login successful',true);
   }

   return util.Result(util.ERR,'invalid credentials',false);
}

export function handle_signup(table,username,name,email,password){
   const result = find_user_by_email(table,email);
   if(result.code === util.NONE){
      //a new unique user has be identified
      const new_user = USR.User(
         username,
         name,
         email,
         password
      );
      table.add(new_user);
      console.log("account created");
      console.log(table.get(new_user.key()));
      return util.Result(util.OK,'new account created',true);
   }
   return util.Result(util.ERR,'account already exists',false);
}

// add new time slot reservation to server
export function handle_reservation_request(space,new_resrv){
   return SPACE.add_reservation(space,new_resrv);
}

export function remove_reservation(space,cur_resrv){
   let match = space.reservations.findIndex(res => res.equals(cur_resrv)); 
   if(match === -1) return util.Result(util.ERR,'reservation does not exist',false);
   
   delete space.reservations[match];
   return util.Result(util.RES_OK,'resevations was removed',true);
}
