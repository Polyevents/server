const router = require("express").Router();
const {
	handleLogin,
	handleSignup,
	getExistingUser,
	getReferralcode,
	handleUsernameUpdate,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/", verifyToken, getExistingUser);
router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.get("/referral-code", verifyToken, getReferralcode);
router.put("/username", verifyToken, handleUsernameUpdate);

module.exports = router;
