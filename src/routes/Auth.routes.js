const router = require("express").Router();
const {
	handleSignup,
	getLoggedUser,
	getReferralcode,
	handleUsernameUpdate,
	getHoldingOfSpecificEvent,
	doesUserExist,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/", verifyToken, getLoggedUser);
router.get("/exists", doesUserExist);
router.post("/signup", handleSignup);
router.get("/referral-code", verifyToken, getReferralcode);
router.put("/username", verifyToken, handleUsernameUpdate);
router.get("/holding/:eventid", verifyToken, getHoldingOfSpecificEvent);

module.exports = router;
