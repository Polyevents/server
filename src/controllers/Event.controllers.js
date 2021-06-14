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

module.exports = { requestEvent };
