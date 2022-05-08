import {NextFunction, Request, Response} from "express";


const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    if(token===config.TOKEN_SECRET){
        next()
    }else{
        return res.status(401).send("Invalid Token");
    }

};

export default verifyToken
