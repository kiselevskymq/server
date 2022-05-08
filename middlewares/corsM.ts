import {Response, Request, NextFunction} from 'express'

export default function corsM(req:Request, res:Response, next:NextFunction) {
    res.setHeader("Access-Control-Allow-Origin", 'https://qwertyo-kiselevskym.vercel.app/');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
    next()
}
