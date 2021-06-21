const jwt = require("jsonwebtoken");
const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		let userMessage = "Log in to continue!";
		const errorObject = handleMessage("NOT_LOGGED_IN", null, userMessage);
		return res.status(errorObject.status).json(errorObject);
	}

	const token = authorization.replace("Bearer ", "");
	if (!token) {
		let userMessage = "Log in to continue!";
		const errorObject = handleMessage("NOT_LOGGED_IN", null, userMessage);
		return res.status(errorObject.status).json(errorObject);
	}

	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err) {
			let userMessage = "Log in to continue!";
			const errorObject = handleMessage("NOT_LOGGED_IN", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
		}

		const { id } = payload;
		const fetchedUser = await db("users")
			.where({ id: id })
			.select("*")
			.innerJoin("user_roles", "users.id", "user_roles.user_id");
		try {
			req.user = fetchedUser[0];
			next();
		} catch (err) {
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
