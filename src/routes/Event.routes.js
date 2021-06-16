const router = require("express").Router();
const {
	requestEvent,
	getEventsOfSpecificMarket,
	createEvent,
	getEventsOfFollowedMarkets,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.post("/request", verifyToken, requestEvent);
router.get("/:marketId", verifyToken, getEventsOfSpecificMarket);
router.post("/add/:marketId", createEvent);
router.get("/user", verifyToken, getEventsOfFollowedMarkets);

module.exports = router;
