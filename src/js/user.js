// Create users object
export function User(username, name, email) {
      function key(){
         return username.concat(email);
      }
	return { username: username, name: name, email: email, key: key};
}
