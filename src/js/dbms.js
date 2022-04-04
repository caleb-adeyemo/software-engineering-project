import * as fs from 'fs'; 

export const OK   = Symbol("query was successful");
export const ERR  = Symbol("query result is erronous,maybe null");
export const NONE = Symbol("query result is empty");
export function Result(code,msg,unwrap){
   return {code:code,msg:msg,unwrap:unwrap};
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

