const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const signJwt = (id) => {
	const token = jwt.sign({ id }, JWT_SECRET);
	return token;
};

module.exports = signJwt;
