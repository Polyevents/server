const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const handleOffset = require("../utils/OffsetHandler");
const debug = require("../utils/DebugHandler");

const getPortfolioDetails = async (req, res, next) => {
	let userId = req.user.user_id;
	try {
		await db.transaction(async (trx) => {
			let portfolioDetailsArray = await trx("portfolios").where({
				user_id: userId,
			});

			let portfolioDetails = portfolioDetailsArray[0];

			const fetchedHoldings = await trx("holdings")
				.innerJoin("events", "holdings.event_id", "events.id")
				.where({ user_id: userId })
				.andWhere({ is_resolved: false });

			let portfolioValue = fetchPastHoldings.reduce((acc, current) => {
				return (
					acc +
					(i.token_type
						? i.number_of_tokens * i.yes_price
						: i.number_of_tokens * i.yes_price)
				);
			}, 0);

			portfolioDetails = {
				...portfolioDetails,
				portfolioValue: portfolioValue,
			};

			let userMessage = null;
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				portfolioDetails,
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
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

const fetchHoldings = async (req, res, next) => {
	let userId = req.user.user_id;
	let offset = req.query.offset;

	let offsetResponse = handleOffset(offset);

	if (offsetResponse.error) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	} else if (offsetResponse.message) {
		offset = offsetResponse.message;
	}

	try {
		const limitOfResults = 20;
		offset = offset * limitOfResults;

		const fetchedHoldings = await db("holdings")
			.innerJoin("events", "holdings.event_id", "events.id")
			.where({ user_id: userId })
			.andWhere({ is_resolved: false })
			.orderBy("updated_at", "desc")
			.limit(limitOfResults)
			.offset(offset);

		if (fetchedHoldings.length > 0) {
			let userMessage = "Holdings Found";
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				fetchedHoldings,
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No Holdings Found";
			let errorObj = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObj.status).json(errorObj);
		}
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

const fetchPastHoldings = async (req, res, next) => {
	let userId = req.user.user_id;
	let offset = req.query.offset;

	let offsetResponse = handleOffset(offset);

	if (offsetResponse.error) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	} else if (offsetResponse.message) {
		offset = offsetResponse.message;
	}

	try {
		const limitOfResults = 20;
		offset = offset * limitOfResults;

		const fetchedHoldings = await db("holdings")
			.innerJoin("events", "holdings.event_id", "events.id")
			.where({ user_id: userId })
			.andWhere({ is_resolved: true })
			.orderBy("updated_at", "desc")
			.limit(limitOfResults)
			.offset(offset);

		if (fetchedHoldings.length > 0) {
			let userMessage = "Past Holdings Found";
			let messageObj = handleMessage(
				"REQUEST_SUCCESS",
				fetchedHoldings,
				userMessage
			);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No Holdings Found";
			let errorObj = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObj.status).json(errorObj);
		}
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

module.exports = { getPortfolioDetails, fetchHoldings, fetchPastHoldings };
