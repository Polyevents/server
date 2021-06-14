const router = require("express").Router();
const {
	handleReferralCodeCheck,
	handleUsernameCheck,
	isUserExisting,
} = require("../controllers");

router.get("/username/:username", handleUsernameCheck);

router.get("/referral/:code", handleReferralCodeCheck);

router.get("/user-exists", isUserExisting);
module.exports = router;
