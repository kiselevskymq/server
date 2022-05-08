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


const app: Express = express();
const port = process.env.PORT || 3020;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use(helmet())
app.use(cors())


app.use('/heroes', verifyToken, router);


app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

module.exports = app;
