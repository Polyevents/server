const router = require("express").Router();
const {
	fetchHoldings,
	getPortfolioDetails,
	fetchPastHoldings,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

// require offset in query params ?offset=1
router.get("/", verifyToken, getPortfolioDetails);
router.get("/holdings", verifyToken, fetchHoldings);
router.get("/holdings/past", verifyToken, fetchPastHoldings);

module.exports = router;
