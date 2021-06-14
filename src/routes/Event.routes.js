const router = require("express").Router();
const { requestEvent } = require("../controllers");
const { verifyToken } = require("../middlewares");

router.post("/request", verifyToken, requestEvent);

module.exports = router;
