import *  as util from './dbms.js';
import * as USR from './user.js';
import * as SPACE from './space.js';

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
