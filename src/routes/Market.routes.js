const router = require("express").Router();
const {
	listMarkets,
	followMarket,
	unfollowMarket,
	trendingMarkets,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/list", listMarkets);
router.put("/follow/:id", verifyToken, followMarket);
router.put("/unfollow/:id", verifyToken, unfollowMarket);
router.get("/trending", trendingMarkets);

module.exports = router;
