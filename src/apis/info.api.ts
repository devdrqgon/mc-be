import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "infrastructure/logging"
import UserRepo from 'persistence/mongoose/userRepo'
import { IUserInfo } from "domain/user.domain"
import IUserDoc from "persistence/mongoose/user.docs"

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
            /** Assert exists and unique */
            if (usrInfo.length != 1) {
                switch (usrInfo.length) {  
                    case 0:
                        logging.error(`CONTROLLER:${namespace}`, "[FATAL] no USERNAME found in DB", req.body)
                        break;
                    default:
                        logging.error(`CONTROLLER:${namespace}`, "[FATAL] Multiple USERNAME found in DB", req.body)
                        break;
                }

            return res.status(200).json({usrInfo})
            //todo return res userInf
        }
        })
        .catch((err) => {
            logging.error("[infoAPI]", err.message,err)
            // res err
        })

}

const createOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..", req.body)

    const { username, grossBalance }: IUserInfo = req.body

    const _userInfoDoc: IUserDoc = new UserRepo.Account({
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