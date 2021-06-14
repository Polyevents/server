function handleMessage(codeName, payload, userMessage) {
	switch (codeName) {
		case "REQUEST_SUCCESS":
			return {
				type: "message",
				status: 200,
				message: "Request Successful!",
				userMessage: userMessage,
				payload: payload,
			};
		case "RESOURCE_CREATED":
			return {
				type: "message",
				status: 201,
				message: "Request Successful and Resource Created!",
				userMessage: userMessage,
				payload: payload,
			};
		case "INVALID_REQUEST_SYNTAX":
			return {
				type: "error",
				status: 400,
				message: "Problem with the request. Please try again!",
				userMessage: userMessage,
				payload: payload,
			};
		case "NOT_LOGGED_IN":
			return {
				type: "error",
				status: 401,
				message: "You Must be Logged In to Continue",
				userMessage: userMessage,
				payload: payload,
			};
		case "NOT_FOUND":
			return {
				type: "error",
				status: 404,
				message: "Resource not found!",
				userMessage: userMessage,
				payload: payload,
			};
		case "RESOURCE_EXISTS":
			return {
				type: "error",
				status: 409,
				message: "Resource already exists!",
				userMessage: userMessage,
				payload: payload,
			};
		case "INTERNAL_SERVER_ERROR":
			return {
				type: "error",
				status: 500,
				message: "Unable to process the request. Please try again!",
				userMessage: userMessage,
				payload: payload,
			};
	}
}

module.exports = handleMessage;
