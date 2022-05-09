import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from "./routes";
import verifyToken from "./middlewares/verifyToken";
import helmet from "helmet";

const cors = require('cors')


dotenv.config();

const databaseURI = 'mongodb+srv://kiselevskym:maksdo86@cluster0.cnzfx.mongodb.net/kievsk'

mongoose.connect(databaseURI).then(() => console.log("connected"))
mongoose.set('debug', !!process.env.DATABASE_URI);


const index: Express = express();
const port = process.env.PORT || 3020;


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}


index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(express.static('public'))
index.use(helmet())

//index.options('*', cors())
//index.use(cors(corsOptions));

index.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // @ts-ignore
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');


    next();
});

index.use('/heroes', verifyToken, router);


index.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = index;
