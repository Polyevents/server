const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const createId = require("../utils/IdGenerator");
const handleOffset = require("../utils/OffsetHandler");

const requestEvent = async (req, res, next) => {
	let userId = req.user.user_id;
	let eventId = await createId();

	let { marketId, eventText } = req.body;

	if (!marketId || !eventText) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let newEvent = await db("requested_events").insert({
			id: eventId,
			user_id: userId,
			market_id: marketId,
			event_text: eventText,
		});

		let userMessage = "Event Request Submitted";
		let messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
		res.status(messageObj.status).json(messageObj);
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

const getEventsOfSpecificMarket = async (req, res, next) => {
	let marketId = req.params.marketId;
	let offset = req.query.offset;

	if (!marketId) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

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

		let events = await db("events")
			.where({ market_id: marketId })
			.offset(offset)
			.orderBy("created_at", "desc")
			.limit();

		if (events.length > 0) {
			let userMessage = "Events Found";
			let messageObj = handleMessage("REQUEST_SUCCESS", events, userMessage);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No Events Found";
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

const createEvent = async (req, res, next) => {
	let id = await createId();
	let marketId = req.params.marketId;
	let { imageLink, questionText, resolveDate, bidCloseDate, source, remark } =
		req.body;

	try {
		let createdEvent = db("events").insert({
			id,
			market_id: marketId,
			image_link: imageLink,
			question_text: questionText,
			resolve_date: resolveDate,
			bid_close_date: bidCloseDate,
			source,
			remark,
		});

		return res.status(200).json({ message: "Event Created!" });
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

const getEventsOfFollowedMarkets = async (req, res, next) => {
	let followedMarkets = req.user.markets_followed;
	let offset = req.query.offset;

	if (!offset) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	let numberTester = /^[0-9]+$/;

	if (!numberTester.test(offset)) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	offset = parseInt(offset);

	if (offset < 0) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		const limitOfResults = 20;
		offset = offset * limitOfResults;

		let events = await db("events")
			.where((builder) => {
				builder.whereIn("market_id", followedMarkets);
			})
			.limit(limitOfResults)
			.orderBy("created_at", "desc")
			.offset(offset);

		if (events.length > 0) {
			let userMessage = "Events Found";
			let messageObj = handleMessage("REQUEST_SUCCESS", events, userMessage);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No Events Found";
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

const getSpecificEvent = async (req, res, next) => {
	let eventId = req.params.eventid;

	try {
		let event = await db("events").where({ id: eventId }).select("*");

		if (event.length > 0) {
			let userMessage = "event found";
			let messageObj = handleMessage("REQUEST_SUCCESS", event[0], userMessage);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No such event";
			const errorObject = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
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

const fetchChartDetailsOfSpecificEvent = async (req, res, next) => {
	let eventId = req.params.eventid;
	let yesterdayDate = new Date(Date.now() - 86400000).toISOString();

	try {
		let bidData = await db("bids")
			.where({ event_id: eventId })
			.andWhere("created_at" > yesterdayDate)
			.orderBy("created_at", "desc")
			.select(
				"id",
				"event_id",
				"yes_price",
				"no_price",
				"created_at",
				"updated_at"
			);

		if (bidData.length > 0) {
			let userMessage = null;
			let messageObj = handleMessage("REQUEST_SUCCESS", bidData, userMessage);
			return res.status(messageObj.status).json(messageObj);
		} else {
			let userMessage = "No bid data";
			const errorObject = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
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

const placeBuyBid = async (req, res, next) => {};

const placeSellBid = async (req, res, next) => {};

module.exports = {
	getSpecificEvent,
	requestEvent,
	getEventsOfSpecificMarket,
	createEvent,
	getEventsOfFollowedMarkets,
	fetchChartDetailsOfSpecificEvent,
	placeBuyBid,
	placeSellBid,
};
