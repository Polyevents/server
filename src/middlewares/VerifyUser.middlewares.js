const jwt = require("jsonwebtoken");
const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const { JWT_SECRET } = process.env;

const debug = require("../utils/DebugHandler");

function loginErrorMessage(res) {
	let userMessage = "Log in to continue!";
	const errorObject = handleMessage("NOT_LOGGED_IN", null, userMessage);
	return res.status(errorObject.status).json(errorObject);
}

const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) return loginErrorMessage(res);

	const token = authorization.replace("Bearer ", "");
	if (!token) return loginErrorMessage(res);

	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err) return loginErrorMessage(res);

		const { id } = payload;

		try {
			const fetchedUser = await db("users")
				.innerJoin("user_roles", "users.id", "user_roles.user_id")
				.where({ user_id: id });
			debug(
				"VerifyUser.middleware.js",
				32,
				"Checking the fetched user from jwt after joining",
				fetchedUser[0]
			);

			if (!fetchedUser[0]) return loginErrorMessage(res);

			req.user = fetchedUser[0];
			next();
		} catch (err) {
			debug("VerifyUser.middleware", 42, "catch error", err.message);

			let userMessage = "Server facing an error!";
			const errorObject = handleMessage(
				"INTERNAL_SERVER_ERROR",
				null,
				userMessage
			);
			return res.status(errorObject.status).json(errorObject);
		}
	});
};

module.exports = { verifyToken };
