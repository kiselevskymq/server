import express, {Express} from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from "./routes";
import verifyToken from "./middlewares/verifyToken";
import helmet from "helmet";

const cors = require('cors')


dotenv.config();

const databaseURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/ac'

mongoose.connect(databaseURI).then(() => console.log("connected"))
mongoose.set('debug', !!process.env.DATABASE_URI);


const index: Express = express();
const port = process.env.PORT || 3020;

index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(express.static('public'))
index.use(helmet())
index.use(cors())


index.use('/heroes', verifyToken, router);


index.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = index;
