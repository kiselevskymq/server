import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from "./routes";
import helmet from "helmet";

const cors = require('cors')


dotenv.config();

const databaseURI = 'mongodb+srv://kiselevskym:maksdo86@cluster0.cnzfx.mongodb.net/kievsk'

mongoose.connect(databaseURI).then(() => console.log("connected"))
mongoose.set('debug', !!process.env.DATABASE_URI);


const index: Express = express();
const port = process.env.PORT || 3020;


var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}


index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(express.static('public'))
index.use(helmet())

//index.options('*', cors())
index.use(cors(corsOptions));




index.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = index;
