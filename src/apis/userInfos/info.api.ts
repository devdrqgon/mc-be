import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import { userInfo } from "os"
import { Bill, InfosOfUser, IUserInfo, SalaryInfo } from "../../domain/user.domain"
import logging from "../../infrastructure/logging"
import IUserDoc, { IUserInfoDoc } from "../../persistence/user/user.docs"
import { UserRepo } from "../../persistence/user/user.repo"

const namespace = "CONTROLLER:[USERINFO]"

const getAllUserInfos = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get all UserInfos..", req.body)

}

//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.query.username)

    const username = req.params.username as string
    UserRepo.Info.find({ username })
        .exec()
        .then((usrInfo) => {
            return res.status(200).json({ info: usrInfo })
        })
        .catch((err) => {
            logging.error("[userInfoAPI]", err.message, err)

            return res.status(409).json({ message: 'no user info found' })
        })

}

const createOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..", req.body)

    const { username: reqUsername, salary: reqSalary, dayOfMonthOfSalary, bills: reqBills } = req.body

    const getBills = () => {

        let _bills: Array<any> = []

        // Mongoose needs keeys for his Map of bills
        for (let i in reqBills)
            _bills.push([i,reqBills[i]])

        return _bills 
    }

    


    const _userInfoDoc = new UserRepo.Info({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        username: reqUsername,
        salary: reqSalary,
        dayOfMonthOfSalary: dayOfMonthOfSalary,
        bills:  getBills()

    })

    //Save it!

    return _userInfoDoc.save()
        .then((info: any) => {
            logging.info(`CONTROLLER:${namespace}`, " UserInfo Created..", req.body)

            res.status(201).json({ info })
        })
        .catch((error: any) => {
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