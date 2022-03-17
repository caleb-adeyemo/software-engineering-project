module.exports.User = User;
// Create users object
function User(username, name, email) {
	return { username: username, name: name, email: email };
}
