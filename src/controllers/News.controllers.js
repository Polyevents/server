const db = require("../config/config");
const handleMessage = require("../utils/MessageHandler");
const fetch = require("node-fetch");
const { NEWS_API_KEY } = process.env;
const createId = require("../utils/IdGenerator");

const fetchNews = async (req, res, next) => {
	try {
		let newsPosts = await db("news")
			.orderBy("created_at", "desc")
			.limit(10)
			.select("*");

		if (newsPosts.length === 0) {
			let userMessage = "News Not Found";
			let errorObj = handleMessage("NOT_FOUND", null, userMessage);
			return res.status(error.status).json(errorObj);
		}

		let userMessage = "News found";
		let messageObj = handleMessage("REQUEST_SUCCESS", newsPosts, userMessage);
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

const storeNews = async (req, res, next) => {
	try {
		let news = await fetch(
			`https://newsapi.org/v2/top-headlines?category=general&country=in&apiKey=${NEWS_API_KEY}&pageSize=10`
		);
		news = await news.json();
		let newsArray = await Promise.all(
			news.articles.map(async (i) => {
				let id = await createId();
				return {
					id,
					source: i.source.name,
					news_link: i.url,
					image_link: i.urlToImage,
					heading: i.title,
					published_at: i.publishedAt,
				};
			})
		);
		if (newsArray.length > 0) {
			const rows = newsArray;
			const chunkSize = 10;
			let insertedRows = await db
				.batchInsert("news", rows, chunkSize)
				.returning("*");
			return res.status(201).json({ message: "Rows Inserted!" });
		}
		return res.status(404).json({ error: "No News Found!" });
	} catch (err) {
		return res.status(500).json({ error: "Error while fetching news" });
	}
};

const deleteNews = async (req, res, next) => {
	try {
		let oldDate = Date.now() - 86400 * 2;
		let deletedNews = await db("news").where("created_at", "<", oldDate).del();
		return res.status(200).json({ message: "News Deleted!" });
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

module.exports = { fetchNews, storeNews, deleteNews };
