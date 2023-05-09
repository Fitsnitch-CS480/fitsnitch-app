
/**
 * In order to interact with the db, you'll need AWS credentials
 * in your env vars. Add them to a '.env' file and they'll be set
 * automatically here.
 */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import PushNotificationService from "./services/PushNotificationService";
import SnitchRouter from "./routes/snitch.routes";
import LambdaRouter from "./routes/lambda.routes";
import UserRouter from "./routes/user.routes";
import CheatRouter from "./routes/cheat.routes";



const app = express();
app.use(cors());
app.use(express.json());

let port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log("Server listening on port "+ port);
})

app.get('/', (req, res) => {
	res.send("FitSnitch API");
});


app.use('/user', UserRouter);
app.use('/snitch', SnitchRouter);
app.use('/cheat', CheatRouter);
app.use('/lambda', LambdaRouter);


app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.status || 500).json({
		message: err.publicMessage || 'Unknown Error',
		details: err.details,
	})
})
