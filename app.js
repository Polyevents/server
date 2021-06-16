const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	logger(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

//db connection
const db = require("./src/config/config");
try {
	let testMarkets = db.select("*").from("markets");
	if (testMarkets) console.log("db connected!");
} catch (err) {
	console.log("Error with db connection!");
}

// Routes
app.get("/", (req, res) => {
	res.writeHead(301, { Location: "https://polyevents.in" });
	res.end();
});

const {
	handleAuth,
	handleValidity,
	handleMarket,
	handleEvent,
	handleNews,
} = require("./src/routes");

app.use("/api/v1/user", handleAuth);
app.use("/api/v1/check", handleValidity);
app.use("/api/v1/market", handleMarket);
app.use("/api/v1/event", handleEvent);
app.use("/api/v1/news", handleNews);
// app.use("/api/v1/comment", handleComments);

//Port listener
const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => console.log("App is running on port " + PORT));
