const {
	handleLogin,
	handleSignup,
	getExistingUser,
	getReferralcode,
	handleUsernameUpdate,
} = require("./Auth.controllers.js");

const {
	handleReferralCodeCheck,
	handleUsernameCheck,
	isUserExisting,
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
} = require("./Event.controllers");

const { fetchNews, storeNews, deleteNews } = require("./News.controllers");

// const { getEventComments } = require("./Comment.controllers");

module.exports = {
	getEventsOfFollowedMarkets, 
	createEvent,
	getEventsOfSpecificMarket,
	deleteNews,
	storeNews,
	fetchNews,
	handleLogin,
	unfollowMarket,
	handleUsernameUpdate,
	handleSignup,
	isUserExisting,
	getReferralcode,
	followMarket,
	getExistingUser,
	handleReferralCodeCheck,
	handleUsernameCheck,
	listMarkets,
	requestEvent,
	trendingMarkets,
};
