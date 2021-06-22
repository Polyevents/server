const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const createId = require("../utils/IdGenerator");
const handleOffset = require("../utils/OffsetHandler");

const getAllCommentsOfEvent = async (req, res, next) => {
	let eventId = req.params.eventid;
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

		let comments = await db("comments")
			.where({ event_id: eventId })
			.orderBy("created_at", "desc")
			.limit(limitOfResults)
			.offset(offset);

		if (comments.length === 0) {
			let userMessage = "No comments found";
			const errorObj = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(errorObj.status).json(errorObj);
		}

		let userMessage = "Comments Found!";
		const messageObject = handleMessage(
			"REQUEST_SUCCESS",
			comments,
			userMessage
		);
		return res.status(messageObject.status).json(messageObject);
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

const likeComment = async (req, res, next) => {
	let userId = req.user.user_id;
	let commentId = req.params.commentid;

	try {
		await db.transaction(async (trx) => {
			let likedByArray = await trx("comments")
				.where({ id: commentId })
				.select("liked_by");
		});

		let likedBy = likedByArray[0];

		if (likedBy.includes(userId)) {
			let userMessage = "Comment already liked.";
			const errorObject = handleMessage("RESOURCE_EXISTS", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
		} else {
			likedBy.push(userId);
			let updatedCommentArray = await trx("comments").update({
				liked_by: likedBy,
			});
			let userMessage = "Comment Liked!";
			let messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
			return res.status(messageObj.status).json(messageObj);
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

const unlikeComment = async (req, res, next) => {
	let userId = req.user.user_id;
	let commentId = req.params.commentid;

	try {
		await db.transaction(async (trx) => {
			let likedByArray = await trx("comments")
				.where({ id: commentId })
				.select("liked_by");
		});

		let likedBy = likedByArray[0];

		if (!likedBy.includes(userId)) {
			let userMessage = "Comment already not liked.";
			const errorObject = handleMessage("RESOURCE_EXISTS", null, userMessage);
			return res.status(errorObject.status).json(errorObject);
		} else {
			const index = likedBy.indexOf(userId);
			if (index > -1) {
				likedBy.splice(index, 1);
			}
			let updatedCommentArray = await trx("comments").update({
				liked_by: likedBy,
			});
			let userMessage = "Comment unliked!";
			let messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
			return res.status(messageObj.status).json(messageObj);
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

const addComment = async (req, res, next) => {
	let userId = req.user.user_id;
	let commentId = await createId();
	let commentText = req.body.commentText;
	let eventId = req.params.eventid;

	try {
		let newComment = await db("comments").insert({
			id: commentId,
			user_id: userId,
			Comment_text: commentText,
			event_id: eventId,
		});

		let userMessage = "Comment Added";
		let messageObj = handleMessage("RESOURCE_CREATED", null, userMessage);
		return res.status(messageObj.status).json(messageObj);
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

const deleteComment = async (req, res, next) => {
	let commentId = req.params.commentid;
	let userId = req.user.user_id;

	try {
		await db.transaction(async (trx) => {
			let comment = await trx("comments").where("id", commentId);

			if (comment[0].user_id === userId) {
				let deleteComment = await trx("comments").where("id", commentId).del();

				let userMessage = "Comment Deleted";
				let messageObj = handleMessage("REQUEST_SUCCESS", null, userMessage);
				return res.status(messageObj.status).json(messageObj);
			} else {
				let userMessage = "You are not authorised to delete this comment";
				let errorObj = handleMessage("NOT_LOGGED_IN", null, userMessage);
				return res.status(errorObj.status).json(errorObj);
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

module.exports = {
	getAllCommentsOfEvent,
	likeComment,
	unlikeComment,
	deleteComment,
	addComment,
};
