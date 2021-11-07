import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging";
import bcryptjs from 'bcryptjs'
import UserRepo from '../../persistence/mongoose/user.schemas'
import { IUserInfo } from "../../domain/user.domain";
import IUserDoc from "../../persistence/mongoose/user.docs";

const namespace = "CONTROLLER:[USERINFO]"

const getAllUserInfos = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get all UserInfos..",req.body)

}

const getOneUserInfo = () => { }

const createOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..",req.body)

    const { username, grossBalance }: IUserInfo = req.body

    const _userInfoDoc: IUserDoc = new UserRepo.Account({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        username,
        grossBalance
    })

    return _userInfoDoc.save()
            .then((info) => {
                logging.info(`CONTROLLER:${namespace}`, " UserInfo Created..",req.body)

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




export default{
    getOneUserInfo,
    getAllUserInfos,
    createOneUserInfo,
    UpdateOneUserInfo
}