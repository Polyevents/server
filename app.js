import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import knex from "knex";
import dotenv from "dotenv";

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

//db config
const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;
const db = knex({
	client: "pg",
	version: "12.5",
	connection: {
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: "postgres",
	},
});

// Routes

app.get("/", (req, res) => {
	res.status(200).send("<h1>Welcome to polyevents!	</h1>");
});

//Port listener
const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => console.log("App is running on port " + PORT));
