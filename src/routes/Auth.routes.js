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

router.post("/exists", doesUserExist);
router.put("/username", verifyToken, handleUsernameUpdate);
router.get("/referral-code", verifyToken, getReferralcode);
router.post("/signup", handleSignup);

router.get("/", verifyToken, getLoggedUser);

router.get("/holding/:eventid", verifyToken, getHoldingOfSpecificEvent);

module.exports = router;
