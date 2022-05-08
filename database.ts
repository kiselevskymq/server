import * as mongoose from "mongoose";


export default async function () {
    await mongoose.connect(process.env.MONGO || 'mongodb://localhost:27017/ac');
}
