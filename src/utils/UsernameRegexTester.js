const handleMessage = require("./MessageHandler");

let regex = /^(?=.{5,14}$)(?![])(?!.*[]{2})[a-z0-9_]+(?<![_])$/;

function checkUsername(username) {
	let isUsernameValid = regex.test(username);
	let flag = true;
	if (!isUsernameValid) flag = false;

	return flag;
}

module.exports = checkUsername;
