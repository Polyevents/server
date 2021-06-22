const {
	handleSignup,
	getLoggedUser,
	getReferralcode,
	handleUsernameUpdate,
	doesUserExist,
	getHoldingOfSpecificEvent,
} = require("./Auth.controllers.js");

const {
	handleReferralCodeCheck,
	handleUsernameCheck,
} = require("./CheckValidity.controllers");

const {
	listMarkets,
	followMarket,
	unfollowMarket,
	trendingMarkets,
} = require("./Market.controllers");

const {
	requestEvent,
	getEventsOfSpecificMarket,
	createEvent,
	getEventsOfFollowedMarkets,
	getSpecificEvent,
	fetchChartDetailsOfSpecificEvent,
	placeBuyBid,
	placeSellBid,
} = require("./Event.controllers");

const { fetchNews, storeNews, deleteNews } = require("./News.controllers");

const {
	getAllCommentsOfEvent,
	addComment,
	deleteComment,
	likeComment,
	unlikeComment,
} = require("./Comment.controllers");

const {
	getPortfolioDetails,
	fetchHoldings,
	fetchPastHoldings,
} = require("./Portfolio.controllers");

module.exports = {
	getHoldingOfSpecificEvent,
	getSpecificEvent,
	getPortfolioDetails,
	fetchHoldings,
	fetchPastHoldings,
	addComment,
	deleteComment,
	likeComment,
	unlikeComment,
	getAllCommentsOfEvent,
	doesUserExist,
	getEventsOfFollowedMarkets,
	createEvent,
	getEventsOfSpecificMarket,
	deleteNews,
	storeNews,
	fetchNews,
	unfollowMarket,
	handleUsernameUpdate,
	handleSignup,
	getReferralcode,
	followMarket,
	getLoggedUser,
	handleReferralCodeCheck,
	handleUsernameCheck,
	listMarkets,
	requestEvent,
	trendingMarkets,
	fetchChartDetailsOfSpecificEvent,
	placeBuyBid,
	placeSellBid,
};
