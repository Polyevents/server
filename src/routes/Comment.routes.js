const router = require("express").Router();
const {
	getAllCommentsOfEvent,
	addComment,
	deleteComment,
	likeComment,
	unlikeComment,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

// requires a query string to handle offset. Example: ?offset=10
router.get("/:eventid/all", verifyToken, getAllCommentsOfEvent);
router.put("/like/:commentid", verifyToken, likeComment);
router.put("/unlike/:commentid", verifyToken, unlikeComment);
router.post("/add/:eventid", verifyToken, addComment);
router.delete("/:commentid", verifyToken, deleteComment);

module.exports = router;
