const handleMessage = require("./MessageHandler");

let regex = /^(?=.{5,14}$)[a-zA-Z0-9]*$/;

function checkUsername(username) {
	let isUsernameValid = regex.test(username);
	let flag = true;
	if (!isUsernameValid) flag = false;

	return flag;
}

module.exports = checkUsername;
