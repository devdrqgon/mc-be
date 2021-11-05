import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import logging from "../config/logging";
import bcryptjs from 'bcryptjs'
import User from '../models/user.model'
import signJWT from "../functions/signJWT";
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
        User.find({ username })
            .exec()
            .then(usrs => {
                if (usrs.length !== 0) {
                    return res.status(500).json({
                        message: 'Username already taken'
                    })
                }
            })



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


const logInUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    User.find({ username })
        .exec()
        .then(users => {
            //Check that username is found and unique,  TODO: do check that user is unqiue  in register methode!
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            const user = users[0]
            //alles gut, let s verify password
            bcryptjs.compare(
                password,
                user.password,
                (error, result) => {
                    if (error) {
                        logging.error(NAMESPACE, `Wrong password::  ${error.message}`, error)
                        //PASSWORD MISSMATCH!
                        return res.status(401).json({
                            message: 'Unauthorized'
                        })
                    }
                    else if (result) {
                        signJWT(user, (_error, token) => {
                            if (_error) {
                                logging.error(NAMESPACE, 'Unable to sign token', _error)

                                return res.status(401).json({
                                    message: 'Unauthorized'
                                })
                            }
                            else if (token) {
                                logging.info(NAMESPACE, `login for ${user.username} successfull!`)
                                return res.status(200).json({
                                    message: 'Auth Successfull',
                                    token,
                                    user
                                })
                            }
                        })
                    }
                }
            )

        })
        .catch(_error => {
            logging.error(NAMESPACE, _error.message, _error)
            return res.status(500).json({
                message: _error.message,
                error: _error
            })
        })
}


const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then(result => {
            return res.status(200).json({
                result,
                count: result.length
            })
        })
        .catch(_error => {
            logging.error(NAMESPACE, _error.message, _error)
            return res.status(500).json({
                message: _error.message,
                error: _error
            })
        })
}

export default {
    validateToken,
    registerUser,
    logInUser,
    getAllUsers
}

