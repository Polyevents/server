const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const signJwt = require("../utils/SignJwt");
const createId = require("../utils/IdGenerator");
const checkUsername = require("../utils/UsernameTester");

const handleLogin = async (req, res, next) => {
	const { email, googleUid } = req.body;

	if (!email || !googleUid) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let user = await db("users")
			.where({ email: email })
			.andWhere({ google_uid: googleUid })
			.select("*");

		if (user.length === 0) {
			let userMessage = "User Not Found!";
			const errorObj = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObj.status).json(errorObj);
		}

		let userMessage = null;
		let userId = user.id;
		const JWT_TOKEN = signJwt(userId);
		const messageObj = handleMessage(
			"REQUEST_SUCCESS",
			{ jwtToken: JWT_TOKEN },
			userMessage
		);
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

const handleSignup = async (req, res, next) => {
	let {
		email,
		googleUid,
		username,
		fullName,
		age,
		profileImage,
		marketsFollowed,
		referralCodeUsed,
	} = req.body;

	if (
		!email ||
		!googleUid ||
		!username ||
		!fullName ||
		!age ||
		!profileImage ||
		!marketsFollowed
	) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	age = parseInt(age);
	fullName = fullName.toLowerCase();
	email = email.toLowerCase();
	username = username.toLowerCase();

	let userId = await createId();
	let referralCodeId = await createId();
	let referralCode = await createId();
	let portfolioId = await createId();

	try {
		await db.transaction(async (trx) => {
			let returnedUserId = await trx("users").insert(
				{
					id: userId,
					google_uid: googleUid,
					email,
					username,
					full_name: fullName,
					age,
					profile_image: profileImage,
					markets_followed: marketsFollowed,
				},
				"id"
			);

			let newReferralCode = await trx("referral_codes").insert({
				id: referralCodeId,
				code: referralCode,
				user_id: returnedUserId[0],
			});

			let newPortfolio = await trx("portfolios").insert({
				id: portfolioId,
				user_id: returnedUserId[0],
			});

			if (referralCodeUsed) {
				let referralCodeUser = await trx("referral_codes")
					.where({ code: referralCodeUsed })
					.update(
						{
							users_joined: db.raw("array_append(users_joined, ?)", [
								returnedUserId[0],
							]),
						},
						"user_id"
					);

				let userOfReferralCode = await trx("portfolios")
					.where({
						user_id: referralCodeUser[0],
					})
					.increment("wallet_balance", 50);

				let newUser = await trx("portfolios")
					.where({
						user_id: returnedUserId[0],
					})
					.increment("wallet_balance", 50);
			}

			let jwtToken = signJwt(returnedUserId[0]);
			let userMessage = "Sign in Done!";
			const messageObj = handleMessage(
				"REQUEST_SUCCESS",
				{ jwtToken: jwtToken },
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		});
	} catch (err) {
		let userMessage = "Server facing an error. Create account again!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

const getExistingUser = async (req, res, next) => {
	let userMessage = null;
	const messageObj = handleMessage("REQUEST_SUCCESS", req.user, userMessage);
	return res.status(messageObj.status).json(messageObj);
};

const getReferralcode = async (req, res, next) => {
	let userId = req.user.id;

	try {
		let userReferralCode = await db("referral_codes")
			.where({ user_id: userId })
			.select("code");

		if (userReferralCode.length === 1) {
			let userMessage = "Found a code";
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				userReferralCode[0],
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		}

		let userMessage = "Server facing an error. Create account again!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	} catch (err) {
		let userMessage = "Server facing an error. Create account again!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

const handleUsernameUpdate = async (req, res, next) => {
	let userId = req.user.id;
	let { newUsername } = req.body;

	if (!newUsername) {
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
		let updatedUsername = await db("users").where({ id: userId }).update(
			{
				username: newUsername,
			},
			"username"
		);

		let userMessage = "Username Updated!";
		let messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
		return res.status(messageObj.status).json(messageObj);
	} catch (err) {
		let userMessage = "Server facing an error. Create account again!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

module.exports = {
	getExistingUser,
	handleLogin,
	handleSignup,
	getReferralcode,
	handleUsernameUpdate,
};
