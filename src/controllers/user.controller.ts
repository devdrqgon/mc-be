import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import bcryptjs from 'bcryptjs'

const NAMESPACE= "User"

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE,"Toekn validated, user authorized..")

    res.status(200).json({
        message: 'Authorized'
    })
}


const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body
    await bcryptjs.hash(password,10,(hashError,hash)=>{
        if(hashError){
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            })
        }

        //TODO: Insert user in DB
    })


     
}


const logInUser = (req: Request, res: Response, next: NextFunction) => {}


const getAllUsers = (req: Request, res: Response, next: NextFunction) => {}

export default {
    validateToken,
    registerUser,
    logInUser,
    getAllUsers
}