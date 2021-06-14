const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");

const listMarkets = async (req, res, next) => {
	try {
		let markets = await db("markets").select("*");
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
	let userId = req.user.id;
	let marketId = req.params.id;

	//check if market exists
	// Append only if market is not followed
	try {
		await db.transaction(async (trx) => {
			let foundMarket = await trx("markets").where(
				{
					id: marketId,
				},
				"id"
			);

			if (foundMarket[0] === marketId) {
				let getUserMarketsArray = await trx("users").where(
					{
						id: userId,
					},
					"markets_followed"
				);

				getUserMarkets = getUserMarketsArray[0];

				if (!getUserMarkets.includes(marketId)) {
					getUserMarkets.push(marketId);
					let followMarket = await trx("users").update(
						{
							markets_followed: getUserMarkets,
						},
						"markets_followed"
					);
					let userMessage = "Market followed";
					const messageObj = handleMessage(
						"REQUEST_SUCCESS",
						null,
						userMessage
					);
					return res.status(messageObj.status).json(messageObj);
				} else {
					let userMessage = "Market Already Followed";
					const errorObject = handleMessage(
						"RESOURCE_EXISTS",
						null,
						userMessage
					);
					return res.status(errorObject.status).json(errorObject);
				}
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
	let userId = req.user.id;
	let marketId = req.params.id;

	try {
		await db.transaction(async (trx) => {
			let foundMarket = await trx("markets").where(
				{
					id: marketId,
				},
				"id"
			);

			if (foundMarket[0] === marketId) {
				let getUserMarketsArray = await trx("users").where(
					{
						id: userId,
					},
					"markets_followed"
				);

				getUserMarkets = getUserMarketsArray[0];

				if (getUserMarkets.includes(marketId)) {
					const index = getUserMarkets.indexOf(marketId);
					if (index > -1) {
						getUserMarkets.splice(index, 1);
					}

					let unFollowMarket = await trx("users").update(
						{
							markets_followed: getUserMarkets,
						},
						"markets_followed"
					);
					let userMessage = "Market unfollowed";
					const messageObj = handleMessage(
						"REQUEST_SUCCESS",
						null,
						userMessage
					);
					return res.status(messageObj.status).json(messageObj);
				} else {
					let userMessage = "Market Already Not Followed";
					const errorObject = handleMessage(
						"RESOURCE_EXISTS",
						null,
						userMessage
					);
					return res.status(errorObject.status).json(errorObject);
				}
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
