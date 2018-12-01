const user = require('./user.js');

const username = "newuser";
const password = "newuserpassword";

async function doTest() {
	try {
		var result = await user.checkPassword(username, password);
		console.log(result);
		process.exit();
	} catch(err) {
		console.log(err);
		throw err;
	}
};

async function doCreateUserTest() {
	try {
		for (i=0; i<1000; i++) {
		var result = await user.createUser(username+i.toString(), password+i.toString());
		console.log(result);
		}
		process.exit();
	} catch(err) {
		console.log(err);
		throw err;
	}
}
