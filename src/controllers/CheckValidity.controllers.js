const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const checkUsername = require("../utils/UsernameTester");

const handleUsernameCheck = async (req, res, next) => {
	const username = req.params.username;

	if (!username) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	let isUsernameValid = checkUsername(username);
	if (!isUsernameValid) {
		let userMessage = "Username can only contain _";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let isUsernameExisting = await db("users")
			.where({ username: username })
			.select("username");

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
};

const handleReferralCodeCheck = async (req, res, next) => {
	let code = req.params.code;

	if (!code) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	if (code.length !== 10) {
		let userMessage = "Invalid Code";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let isReferralCorrect = await db("referral_codes")
			.where({ code: code })
			.select("*");
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
};

const isUserExisting = async (req, res, next) => {
	const { email, googleUid } = req.body;

	if (!email || !googleUid) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let isUserThere = await db("users")
			.where({ email: email })
			.andWhere({ google_uid: googleUid })
			.select("*");

		if (isUserThere.length > 0) {
			let userMessage = "User exists";
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
};

module.exports = {
	handleUsernameCheck,
	handleReferralCodeCheck,
	isUserExisting,
};
