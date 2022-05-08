import {Request, Response} from 'express';
import ISuperhero from "./interfaces/ISuperhero";
import SuperheroModel from "./models/Superhero";
import Superhero from "./models/Superhero";
import Joi from "joi"
import ErrnoException = NodeJS.ErrnoException;
import {Multer} from "multer";

const fs = require('fs')

function fullUrlToUploadFolder(req: Request): string {
    return req.protocol + '://' + req.get('host') + '/uploads/';
}

export const getAllHeroes = async (req: Request, res: Response) => {
    const schema = Joi.object({
        limit: Joi.number().integer().positive(),
        page: Joi.number().integer().positive()
    })

    const {limit = 5, page = 1} = req.query
    const {error} = schema.validate({limit, page})


    if (error) return res.send({error: true, details: error.details})

    const UPLOAD_PATH = fullUrlToUploadFolder(req)
    const offset = +limit * (+page - 1)

    const heroes = await Superhero.aggregate([
        {$skip: offset},
        {$limit: +limit},
        {
            $project: {
                nickname: 1,
                images: {$arrayElemAt: ["$images", 0]}
            }
        },
        {
            $addFields: {
                images: {$concat: [UPLOAD_PATH, "$images"]}

            }
        }
    ])

    const totalHeroes = await Superhero.find().count()
    const totalPages = Math.ceil(totalHeroes / +limit)
    res.send({
        heroes,
        pagination: {
            totalPages
        }
    })

}

export const getHeroByNickname = async (req: Request, res: Response) => {
    const {nickname} = req.params

    const schema = Joi.string().trim().required()
    const {error} = schema.validate(nickname)

    if (error) return res.send({error: true, details: error.details})

    const UPLOAD_PATH = fullUrlToUploadFolder(req)

    const response = await SuperheroModel.aggregate([
        {
            $match: {nickname}
        },
        {
            $addFields: {
                images: {
                    $map: {
                        input: '$images',
                        as: 'item',
                        in: {$concat: [UPLOAD_PATH, "$$item"]}
                    }
                }
            }
        }
    ])
    res.send(response[0])
}

export const isNicknameUnique = async (req: Request, res: Response) => {
    const schema = Joi.string().required()
    const {nickname} = req.params
    const {error} = schema.validate(nickname)

    if (error) return res.send({error: true, details: error.details})

    const result = await SuperheroModel.findOne({nickname})

    if (result === null) return res.send(true)
    return res.send(false)
}

export const createHero = async (req: Request, res: Response) => {
    const {origin_description, real_name, superpowers, nickname, catch_phrase}: ISuperhero = req.body

    const filenames = getFilenamesFromReqFiles(req.files as Express.Multer.File[])


    const superhero = new SuperheroModel()
    superhero.origin_description = origin_description
    superhero.superpowers = superpowers
    superhero.nickname = nickname
    superhero.real_name = real_name
    superhero.catch_phrase = catch_phrase
    superhero.images = filenames

    const result = await superhero.save()
    res.send(result)
}

export const deleteHeroByNickname = async (req: Request, res: Response) => {
    const {nickname} = req.params
    const schema = Joi.string().trim().required()
    const {error} = schema.validate(nickname)

    if (error) return res.send({error: true, details: error.details})

    const response = await SuperheroModel.deleteOne({nickname})
    res.send(response)
}


export const editHero = async (req: Request, res: Response) => {
    const paramsSchema = Joi.string().required()
    const {oldNickname} = req.params
    const paramsValidate = paramsSchema.validate(oldNickname)

    if (paramsValidate.error) return res.send({error: true, details: paramsValidate.error})

    const {
        origin_description,
        real_name,
        superpowers,
        nickname,
        catch_phrase,
        imagesToDelete
    } = req.body

    const parsedImagesToDelete = JSON.parse(imagesToDelete);
    removeImagesFromUploads(parsedImagesToDelete)


    const heroImages: { images: string[] } | null = await SuperheroModel.findOne({nickname: oldNickname}, {images: 1})
    if (heroImages === null) return res.send({error: true, details: ""})


    const filenames = getFilenamesFromReqFiles(req.files as Express.Multer.File[])

    let imagesToDeleteFilenames: string[] = []
    imagesToDeleteFilenames = parsedImagesToDelete.map((item: string) => getFilename(item))

    let updatedListOfImages: string[] = [];

    const listOfImages = heroImages.images;

    listOfImages.forEach((item) => {
        if (imagesToDeleteFilenames.indexOf(item) < 0) {
            updatedListOfImages.push(item)
        }
    })
    updatedListOfImages = listOfImages.filter((item) => imagesToDeleteFilenames.indexOf(item)).concat(filenames)

    const result = await SuperheroModel.updateOne(
        {nickname: oldNickname},
        {
            $set: {
                images: updatedListOfImages,
                nickname,
                real_name,
                origin_description,
                superpowers,
                catch_phrase
            }
        },
        {})

    return res.send(result)

}

function removeImagesFromUploads(files: string[]) {
    if (!Array.isArray(files)) return;

    files.forEach((item: string) => {
        const path = `./public/uploads/${getFilename(item)}`
        fs.unlink(path, function (err: ErrnoException | null) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        })
    })
}

function getFilename(path: string) {
    const arr = path.split("/")
    return arr[arr.length - 1]
}

function getFilenamesFromReqFiles(files: Express.Multer.File[]) {
    return files && files.map(item => item.filename)
}
