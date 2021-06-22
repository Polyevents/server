const handleAuth = require("./Auth.routes");
const handleValidity = require("./CheckValidity.routes");
const handleEvent = require("./Event.routes");
const handleMarket = require("./Market.routes");
const handleNews = require("./News.routes");
const handleComments = require("./Comment.routes");
const handlePortfolio = require("./Porfolio.routes");

module.exports = {
	handlePortfolio,
	handleComments,
	handleAuth,
	handleValidity,
	handleMarket,
	handleEvent,
	handleNews,
};
