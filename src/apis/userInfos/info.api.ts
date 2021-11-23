import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging"
import { UserRepo } from "../../persistence/user/user.schemas"

const namespace = "CONTROLLER:[USERINFO]"

const getAllUserInfos = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get all UserInfos..", req.body)

}

//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.query.username)

    const username = req.params.username as string
    UserRepo.Info.find({ username })
        .select('-updatedAt')
        .select('-createdAt')
        .select('-_id')
        .exec()
        .then((usrInfo) => {
            return res.status(200).json({ usrInfo })
        })
        .catch((err) => {
            logging.error("[userInfoAPI]", err.message, err)

            return res.status(409).json({ message: 'no user info found' })
        })

}

const createOneUserInfo = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..", req.body)

    const {
        username: reqUsername, salary: reqSalary,
        dayOfMonthOfSalary, weeklyBudget: reqWeeklyBudget,
        bills: reqBills, accounts: reqAccounts
    } = req.body



    const _userInfoDoc = new UserRepo.Info({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        username: reqUsername,
        salary: reqSalary,
        dayOfMonthOfSalary: dayOfMonthOfSalary,
        bills: reqBills,
        accounts: reqAccounts,
        weeklyBudget: reqWeeklyBudget

    })

    //Save it!


    return _userInfoDoc.save()
        .then((info: any) => {
            logging.info(`CONTROLLER:${namespace}`, " UserInfo Created..", info)

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