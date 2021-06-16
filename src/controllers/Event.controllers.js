const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const createId = require("../utils/IdGenerator");

const requestEvent = async (req, res, next) => {
	let userId = req.user.id;
	let eventId = await createId();

	let { marketId, eventText } = req.body;

	if (!marketId || !eventText) {
		let userMessage = null;
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null, userMessage);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		let newEvent = await db("requested_events").insert(
			{
				id: eventId,
				user_id: userId,
				market_id: marketId,
				event_text: eventText,
			},
			"id"
		);

		if (newEvent.length !== 1) {
		}

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

	if (!offset || !marketId) {
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
		let events = await db("events")
			.where({ market_id: marketId })
			.offset(offset)
			.orderBy("created_at", "desc")
			.limit(10);

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
	let followedMarkets = req.user.followed_markets;
	let offset = req.query.offset;
	
	try {
		let events = await db("events")
			.where((builder) => {
				builder.whereIn("market_id", followedMarkets);
			})
			.limit(10)
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

module.exports = {
	requestEvent,
	getEventsOfSpecificMarket,
	createEvent,
	getEventsOfFollowedMarkets,
};
