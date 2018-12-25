const user = require('./user.js');

const username = "newuser";
const password = "newuserpassword";
doCreateUserTest();

async function doTest() {
	try {
		for (i=0; i<100; i++) {
			var result = await user.checkPassword(username+i.toString(), password);
			console.log(result);
		}
		process.exit();
	} catch(err) {
		throw err;
	}
};

async function doCreateUserTest() {
	try {
		for (i=0; i<100; i++) {
		var result = await user.createUser(username+i.toString(), password);
		console.log(result);
		};
		doTest();
	} catch(err) {
		throw err;
	}
}
