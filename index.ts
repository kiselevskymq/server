import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from "./routes";
import verifyToken from "./middlewares/verifyToken";
import helmet from "helmet";
import corsM from "./middlewares/corsM";

const cors = require('cors')


dotenv.config();

const databaseURI = 'mongodb+srv://kiselevskym:maksdo86@cluster0.cnzfx.mongodb.net/kievsk'

mongoose.connect(databaseURI).then(() => console.log("connected"))
mongoose.set('debug', !!process.env.DATABASE_URI);


const index: Express = express();
const port = process.env.PORT || 3020;


var allowCrossDomain = function(req: Request, res:Response, next:NextFunction) {
    res.header('Access-Control-Allow-Origin', 'https://front-virid-mu.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var corsOptions = {
    origin: 'https://front-virid-mu.vercel.app',
    optionsSuccessStatus: 200,
}
//index.options('*', cors())
//index.use(cors(corsOptions));
index.use(allowCrossDomain);
index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(express.static('public'))
index.use(helmet())


index.use('/heroes', verifyToken, router);


index.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = index;
