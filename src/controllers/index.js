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

const { requestEvent } = require("./Event.controllers");

module.exports = {
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
