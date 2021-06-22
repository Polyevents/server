const router = require("express").Router();
const {
	listMarkets,
	followMarket,
	unfollowMarket,
	trendingMarkets,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/all", listMarkets);
router.put("/follow/:id", verifyToken, followMarket);
router.put("/unfollow/:id", verifyToken, unfollowMarket);
router.get("/trending", verifyToken, trendingMarkets);

module.exports = router;
