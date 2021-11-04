import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import logging from "../config/logging";
import bcryptjs from 'bcryptjs'
import User from '../models/user.model'
const NAMESPACE = "User"

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Toekn validated, user authorized..")

    res.status(200).json({
        message: 'Authorized'
    })
}


const registerUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            })
        }

        const _user = new User({
            id: new mongoose.Types.ObjectId(),
            username,
            password: hash
        })

        return _user.save()
            .then((user) => {
                res.status(201).json({ user })
            })
            .catch((error) => {
                res.status(500).json({
                    message: error.message,
                    error
                })
            })
    })
}


const logInUser = (req: Request, res: Response, next: NextFunction) => { }


const getAllUsers = (req: Request, res: Response, next: NextFunction) => { }

export default {
    validateToken,
    registerUser,
    logInUser,
    getAllUsers
}