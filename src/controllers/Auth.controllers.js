const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const signJwt = require("../utils/SignJwt");
const createId = require("../utils/IdGenerator");
const checkUsername = require("../utils/UsernameRegexTester");

const debug = require("../utils/DebugHandler");

const doesUserExist = async (req, res, next) => {
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

		debug(
			"Auth.cont.js",
			32,
			"getting user after checking if the user exists",
			user
		);

		let userMessage = null;
		let userId = user[0].id;
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
		profileImage,
		marketsFollowed,
		referralCodeUsed,
	} = req.body;

	if (
		!email ||
		!googleUid ||
		!username ||
		!fullName ||
		!profileImage ||
		!marketsFollowed ||
		marketsFollowed.length === 0
	) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	fullName = fullName.toLowerCase();
	email = email.toLowerCase();
	username = username.toLowerCase();

	let userId = await createId();
	let referralCodeId = await createId();
	let referralCode = await createId();
	let portfolioId = await createId();
	let userRoleId = await createId();

	try {
		await db.transaction(async (trx) => {
			let returnedUserId = await trx("users").insert(
				{
					id: userId,
					google_uid: googleUid,
					email,
					username,
					full_name: fullName,
					profile_image: profileImage,
					markets_followed: marketsFollowed,
				},
				"id"
			);

			debug(
				"Auth.cont.js",
				99,
				"Getting returned userid array from trasnaction after creating a user in userstable in signup route.",
				returnedUserId
			);

			let newUserRole = await trx("user_roles").insert({
				id: userRoleId,
				user_id: returnedUserId[0],
			});

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

				debug(
					"Auth.cont.js",
					99,
					"Getting returned userid array from trasnaction after checking the referral code in userstable in signup route.",
					referralCodeUser
				);

				let amountOfBalanceToIncrement = 50;

				let userOfReferralCode = await trx("portfolios")
					.whereIn("user_id", [returnedUserId[0], referralCodeUser[0]])
					.increment("wallet_balance", amountOfBalanceToIncrement);
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

const getLoggedUser = async (req, res, next) => {
	if (!req.user) {
		let userMessage = "Log in to continue!";
		const errorObject = handleMessage("NOT_LOGGED_IN", null, userMessage);
		return res.status(errorObject.status).json(errorObject);
	}

	let userMessage = null;
	const messageObj = handleMessage("REQUEST_SUCCESS", req.user, userMessage);
	return res.status(messageObj.status).json(messageObj);
};

const getReferralcode = async (req, res, next) => {
	let userId = req.user.user_id;

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

		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
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

const handleUsernameUpdate = async (req, res, next) => {
	let userId = req.user.user_id;
	let { newUsername } = req.body;

	if (!newUsername) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	let isUsernameValid = checkUsername(newUsername);
	if (!isUsernameValid) {
		let userMessage = "Username is not valid!";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let updatedUsername = await db("users").where({ id: userId }).update({
			username: newUsername,
		});

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

const getHoldingOfSpecificEvent = async (req, res, next) => {
	let userId = req.user.user_id;
	let eventId = req.params.eventid;

	try {
		let holding = await db("holdings")
			.where({ user_id: userId })
			.andWhere({ event_id: eventId })
			.select("*");

		if (holding.length === 0) {
			let userMessage = "User Not Holding the event";
			const errorObject = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
		} else {
			let userMessage = "Found Holdings";
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				holding[0],
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		}
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
	getHoldingOfSpecificEvent,
	doesUserExist,
	getLoggedUser,
	handleSignup,
	getReferralcode,
	handleUsernameUpdate,
};
