const router = require("express").Router();
const {
	requestEvent,
	getEventsOfSpecificMarket,
	createEvent,
	getSpecificEvent,
	getEventsOfFollowedMarkets,
	fetchChartDetailsOfSpecificEvent,
	placeBuyBid,
	placeSellBid,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.post("/new/request", verifyToken, requestEvent);
// requires an offset in query param as ?offset=1
router.get("/market/:marketId", verifyToken, getEventsOfSpecificMarket);
// requires an offset in query param as ?offset=1
router.get("/user/followed", verifyToken, getEventsOfFollowedMarkets);
router.get("/:eventid", verifyToken, getSpecificEvent);
router.get("/chart/:eventid", verifyToken, fetchChartDetailsOfSpecificEvent);
router.post("/buy/:eventid", verifyToken, placeBuyBid);
router.post("/sell/:eventid", verifyToken, placeSellBid);

// router.post("/new/add", createEvent);

module.exports = router;
