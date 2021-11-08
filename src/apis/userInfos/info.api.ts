import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import { IUserInfo } from "../../domain/user.domain"
import logging from "../../infrastructure/logging"
import IUserDoc, { IUserInfoDoc } from "../../persistence/mongoose/user.docs"
import { UserRepo } from "../../persistence/mongoose/userRepo"

const namespace = "CONTROLLER:[USERINFO]"

const getAllUserInfos = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get all UserInfos..", req.body)

}

//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.body)

    const { username } = req.body

    UserRepo.Info.find({ username })
        .exec()
        .then((usrInfo) => {
            return res.status(200).json({usrInfo})
        })
        .catch((err) => {
            logging.error("[userInfoAPI]", err.message,err)
            // res err
        })

}

const createOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..", req.body)

    const { username, grossBalance }: IUserInfo = req.body

   
    const _userInfoDoc: IUserInfoDoc = new UserRepo.Info({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        username,
        grossBalance
    })

    return _userInfoDoc.save()
        .then((info) => {
            logging.info(`CONTROLLER:${namespace}`, " UserInfo Created..", req.body)

            res.status(201).json({ user: info })
        })
        .catch((error) => {
            logging.error(`CONTROLLER:${namespace}`, " UserInfo POST Failed..", error)

            res.status(500).json({
                message: error.message,
                error
            })
        })

}

const UpdateOneUserInfo = () => { }




export default {
    getOneUserInfo,
    getAllUserInfos,
    createOneUserInfo,
    UpdateOneUserInfo
}