import express, {Express} from "express";
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


const corsOption = {
    credentials: true,
    origin: ['*']
}
index.use(cors(corsOption));

index.use(corsM)


index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(express.static('public'))
index.use(helmet())


index.use('/heroes', verifyToken, router);


index.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = index;
