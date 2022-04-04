import * as util from './dbms.js';
// Create users object
export function User(username, name, email,password) {
      function key(){
         return email;
      }
	return { username: username, name: name, email: email, key: key,password: password};
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
      const new_user = User(
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
