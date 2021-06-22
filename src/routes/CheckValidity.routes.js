const router = require("express").Router();
const {
	handleReferralCodeCheck,
	handleUsernameCheck,
} = require("../controllers");

router.get("/username/:username", handleUsernameCheck);
router.get("/referral/:code", handleReferralCodeCheck);

module.exports = router;
