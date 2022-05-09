import * as util from './dbms.js';
// Create users object
export function User(username, name, email, password) {
      function key(){
         return email;
      }
      function equals(other){
         return email === other.email;
      }
	return { 
         username: username
         ,name: name
         ,email: email
         ,key: key
         ,password: password
         ,equals:equals
      };
}


