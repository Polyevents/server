const router = require("express").Router();
const { fetchNews, storeNews, deleteNews } = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/", verifyToken, fetchNews);
router.get("/store", storeNews);
router.delete("/", deleteNews);

module.exports = router;
