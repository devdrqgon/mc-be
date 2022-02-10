import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import logging from "../../infrastructure/logging"
import { UserRepo } from "../../persistence/user/user.schemas";
import { utils } from "../utils";

const NAMESPACE = "User"

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user authorized..")

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
        UserRepo.Account.find({ username })
            .exec()
            .then(usrs => {
                if (usrs.length !== 0) {
                    return res.status(500).json({
                        message: 'Username already taken'
                    })
                }
            })


        const _userAccountDoc = new UserRepo.Account({
            id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
            username,
            password: hash
        })

        return _userAccountDoc.save()
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
    UserRepo.Account.find({ username })
        .exec()
        .then(users => {
            //Check that username is found and unique,  TODO: do check that user is unqiue  in register methode!
            if (users.length !== 1) {
                if (users.length > 1) {
                    logging.error(NAMESPACE, "User not unique")
                } else { logging.error(NAMESPACE, "User not found ") }

                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            const user = users[0]
            //alles gut, let s verify password
            bcryptjs.compare(
                'amddev',
                'amddev',
                (error, result) => {
                    if (error) {
                        logging.error(NAMESPACE, `Wrong password::  ${error.message}`, error)
                        //PASSWORD MISSMATCH!
                        return res.status(401).json({
                            message: 'Unauthorized'
                        })
                    }
                    else if (result) {
                        utils.signJWT(user, (_error, token) => {
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
    UserRepo.Account.find()
        .select('-password')
        .exec()
        .then(result => {
            return res.status(200).json({
                count: result.length,
                result
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

