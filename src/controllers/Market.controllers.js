const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");

const listMarkets = async (req, res, next) => {
	try {
		let markets = await db("markets").select("*").orderBy("volume", "desc");
		if (markets.length > 0) {
			let userMessage = "Found markets!";
			const messageObj = handleMessage("REQUEST_SUCCESS", markets, userMessage);
			return res.status(messageObj.status).json(messageObj);
		}

		let userMessage = "No markets available";
		const errorObject = handleMessage("NOT_FOUND", null, userMessage);
		return res.status(errorObject.status).json(errorObject);
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

const followMarket = async (req, res, next) => {
	let marketId = req.params.id;
	let userId = req.user.user_id;
	let followedMarkets = req.user.markets_followed;

	try {
		await db.transaction(async (trx) => {
			if (!followedMarkets.includes(marketId)) {
				followedMarkets.push(marketId);
				let followMarket = await trx("users")
					.update({
						markets_followed: followedMarkets,
					})
					.where({ id: userId });
				let userMessage = "Market followed";
				const messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
				return res.status(messageObj.status).json(messageObj);
			} else {
				let userMessage = "Market Already Followed";
				const errorObject = handleMessage("RESOURCE_EXISTS", null, userMessage);
				return res.status(errorObject.status).json(errorObject);
			}
		});
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

const unfollowMarket = async (req, res, next) => {
	let marketId = req.params.id;
	let userId = req.user.user_id;
	let followedMarkets = req.user.markets_followed;

	if (followedMarkets.length === 1) {
		const userMessage = "Can't unfollow all the markets!";
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		await db.transaction(async (trx) => {
			if (followedMarkets.includes(marketId)) {
				const index = followedMarkets.indexOf(marketId);
				if (index > -1) {
					followedMarkets.splice(index, 1);
				}

				let unFollowMarket = await trx("users")
					.update({
						markets_followed: followedMarkets,
					})
					.where({ id: userId });
				let userMessage = "Market unfollowed";
				const messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
				return res.status(messageObj.status).json(messageObj);
			} else {
				let userMessage = "Market Already Not Followed";
				const errorObject = handleMessage("RESOURCE_EXISTS", null, userMessage);
				return res.status(errorObject.status).json(errorObject);
			}
		});
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

const trendingMarkets = async (req, res, next) => {
	try {
		let topMarkets = await db("markets")
			.orderBy("volume", "desc")
			.limit(5)
			.select("*");
		if (topMarkets.length > 0) {
			let userMessage = "Markets Found";
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				topMarkets,
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		}

		let userMessage = "No Markets Found";
		let errorObj = handleMessage("NOT_FOUND", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	} catch (err) {
		let userMessage = "Server facing an error!";
		const errorObject = handleMessage(
			"INTERNAL_SERVER_ERROR",
			null,
			userMessage
		);
		return res.status(errorObject.status).json(errorObject);
	}
};

module.exports = { listMarkets, followMarket, unfollowMarket, trendingMarkets };
