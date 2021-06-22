const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const checkUsername = require("../utils/UsernameRegexTester");

const debug = require("../utils/DebugHandler");

async function handleUsernameTestLogic(username, res) {
	if (!username) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	let isUsernameValid = checkUsername(username);
	if (!isUsernameValid) {
		let userMessage = "Username not valid!";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let isUsernameExisting = await db("users")
			.where({ username: username })
			.select("username");

		debug(
			"CheckValidity.cont.js",
			28,
			"Checking the returned username array",
			isUsernameExisting
		);

		if (isUsernameExisting.length > 0) {
			let userMessage = "Username exists";
			const errorObject = handleMessage("RESOURCE_EXISTS", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
		}

		let userMessage = null;
		const messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
		return res.status(messageObj.status).json(messageObj);
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
}

const handleUsernameCheck = async (req, res, next) => {
	const username = req.params.username;

	return await handleUsernameTestLogic(username, res);
};

async function handleReferralCodeTestLogic(code, res) {
	if (!code) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let isReferralCorrect = await db("referral_codes")
			.where({ code: code })
			.select("*");

		debug(
			"CheckValidity.cont.js",
			62,
			"Checking the returned referral code array",
			isReferralCorrect
		);

		if (isReferralCorrect.length === 1) {
			let userMessage = null;
			const messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
			return res.status(messageObj.status).json(messageObj);
		}

		let userMessage = "Invalid Code";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
}

const handleReferralCodeCheck = async (req, res, next) => {
	let code = req.params.code;
	return await handleReferralCodeTestLogic(code, res);
};

module.exports = {
	handleUsernameCheck,
	handleReferralCodeCheck,
};
