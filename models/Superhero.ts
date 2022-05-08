import {Schema, model} from "mongoose";


const SuperheroSchema = new Schema({
    nickname: {type: String, unique: true, required: true},
    real_name: {type: String, required: true},
    origin_description: {type: String, required: true},
    superpowers: {type: String, required: true},
    catch_phrase: {type: String, required: true},
    images: {type: [String], required: true}
})

const SuperheroModel = model("heroes", SuperheroSchema)

export default SuperheroModel
