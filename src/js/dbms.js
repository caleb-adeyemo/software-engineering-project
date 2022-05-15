import * as fs from 'fs'; 
import * as SPACE from './space.js'; 
import * as RESRV from './reservation.js';
import * as TM from './time.js';
import * as USER from './user.js';

export const OK   = Symbol("query was successful");
export const ERR  = Symbol("query result is erronous, maybe null");
export const NONE = Symbol("query result is empty");
export function Result(code,msg,unwrap){
   return {code:code,msg:msg,unwrap:unwrap};
}

export  function to_str(...args){
   return args.map(str => JSON.stringify(str));
}

export function init_reservation(levels, bay){
   let bookings = new Map();
   let spaces = init_lot(levels,bay); 
   for(let i = 0; i < spaces.length; i++){
       
   }
}

export function Tuple(a,b){
   return [a,b];
}

export function Table(filename){
   let entries = new Map();
   const name = filename;

   function add(new_element){
      entries.set(new_element.key(),new_element);
   }
   function set(key,value){
      entries.set(key,value);
   }
   
   function get(key){
      return entries.get(key);
   }

   function contains(key){
      return entries.has(key);
   }

   function remove(key){
      return entries.delete(key);
   }

   function filter_table(filter_fn){
      let passed = [];

      for(const entry of entries.values()){
         if(filter_fn(entry)){
            passed.push(entry);
         }
      }
      return passed;
   }

   function serialise(){
      let key_pairs = Array.from(entries.entries());
      return JSON.stringify(key_pairs,null,3);
   }
   
   function save_to_file(serialised_item){
      fs.writeFileSync(name,serialised_item); 
   }

   return {
      add:add,
      get:get, 
      set:set,
      contains:contains,
      remove:remove,
      filter_table:filter_table,
      serialise:serialise,
      save_to_file:save_to_file,
      load_from_file:load_from_file
   };
}
function deserialise(path,string){
   let deserialised_map = new Map(JSON.parse(string));
   console.log(deserialised_map);
   let new_table = Table(path);
   for(const entry of deserialised_map.entries()){
      new_table.set(entry[0],entry[1]);
      console.log(entry[0]);
      console.log('result: ' + JSON.stringify(new_table.get(entry[0])));
   }
   return new_table;
}

export function load_from_file(path){
   if(!fs.existsSync(path)){
      return Result(ERR,'file ['+ path + '] does not exist',null);
   }
   const data = fs.readFileSync(path,'utf8'); 
   return Result(OK,'file exists',deserialise(path,data));
}

export function serialise_space_db(space_db){
   let file = {};
   space_db.forEach((value,key) =>{
      console.log(key);
      let ser_arr = value.map(val => val.serialise());
      file[key] = value;
   });   

   return JSON.stringify(file,null,3);
}
export function deserialise_space_db(space_db_file){
   let data = JSON.parse(space_db_file);
   let db = new Map();
   for(const [key,value] of Object.entries(data)){
      let new_lot = [];
      value.forEach(
         space_ser => {
            //console.log(space_ser.reservations);
            let new_space = SPACE.space(space_ser.level,space_ser.bay);
            for(let i = 0; i < space_ser.reservations.length; i++){

               let time = new Date(space_ser.reservations[i].time.start);
               let duration = TM.duration(
                  space_ser.reservations[i].time.duration.hr,
                  space_ser.reservations[i].time.duration.min
               );
               let new_time = TM.time(time,duration);
               let new_user = USER.User(
                  space_ser.reservations[i].user.username,
                  space_ser.reservations[i].user.name,
                  space_ser.reservations[i].user.email,
                  space_ser.reservations[i].user.password
               );
               let new_resrv = RESRV.reservation(
                  new_time,
                  new_user,
                  space_ser.reservations[i].number_plate
               );
               SPACE.add_reservation(new_space,new_resrv);
            }
            new_lot.push(new_space);
         }
      );
      db.set(key,new_lot);
   }
   return db;
}
export function save_space_db(path,serialised_space_db){
   fs.writeFileSync(path,serialised_space_db); 
}
export function load_space_db(path){
   if(!fs.existsSync(path)){
      return null;
   }
   return fs.readFileSync(path);
}
