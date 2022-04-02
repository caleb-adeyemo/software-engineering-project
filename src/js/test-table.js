import * as user from "./user.js";
import * as util from "./dbms.js";
import { strict as assert } from 'assert';

function test_table(){
   console.log("====TEST TABLE====");
   let user_table = util.Table("users");
   const u0 = user.User("vim_enjoyer","target","legoat@gmail.com");
   const u1 = user.User("u1","n1","u1n1@gmail.com");
   const u2 = user.User("u2","n2","u2n2@gmail.com");
   user_table.add(u0);
   user_table.add(u1);
   user_table.add(u2);
   
   assert.deepEqual(user_table.contains(u0.key()),true,"table add and contains work");
   assert.deepEqual(user_table.contains(u1.key()),true,"table add and contains work");
   assert.deepEqual(user_table.contains(u2.key()),true,"table add and contains work");

   let result = user_table.filter_table((user)=>{
     return user.name === "target"
   });

   for(const entry of result){
      console.log(JSON.stringify(entry));
   }

   assert.deepEqual(result.length,1,"filter returns correct number");
   delete result[0];
   assert.deepEqual(user_table.contains(u0.key()),true,"filter always returns copies");
   
   user_table.remove(u1.key());
   assert.deepEqual(user_table.contains(u1.key()),false,"delete works");
}

 function test_table_serialisation(){
   console.log("====TEST SERIALISATION====");
   const path = "users.json";
   let user_table = util.Table(path);
   const u0 = user.User("vim_enjoyer","target","legoat@gmail.com");
   const u1 = user.User("u1","n1","u1n1@gmail.com");
   const u2 = user.User("u2","n2","u2n2@gmail.com");
   user_table.add(u0);
   user_table.add(u1);
   user_table.add(u2);

   const entries = user_table.serialise();
   //console.log(entries);
   user_table.save_to_file(entries);

   let deserialised_table = util.load_from_file(path);
   console.log(deserialised_table);

   assert.deepEqual(deserialised_table.contains(u0.key()),true,'table members are deserialised properly');
   assert.deepEqual(deserialised_table.contains(u1.key()),true,'table members are deserialised properly');
   assert.deepEqual(deserialised_table.contains(u2.key()),true,'table members are deserialised properly');
}

test_table();
test_table_serialisation();
console.log("====ALL TESTS PASSED====");
