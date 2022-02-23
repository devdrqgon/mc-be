import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging"
import nordigen from "../../infrastructure/nordigenAdapter"
import IBalanceDoc from "../../persistence/balance/balance.docs"
import { BalanceRepo } from "../../persistence/balance/balance.schemas"
import { UserRepo } from "../../persistence/user/user.schemas"
import moment from 'moment'
import { GetSumBillsInADuration } from "../bills/bill.api"

const namespace = "CONTROLLER:[USERINFO]"

// 2022-02-10 T 16:04:51+01:00
// 2022-02-10 T15:29:23+01:00
export const shouldIRefresh = (xHours: number, _nowTime: string, _lastUpdateTime: string) => {

    //FormatDate 
    const formattedLastUpdt = moment(_lastUpdateTime)
    const formattedNowTime = moment(_nowTime)
    console.log("formattedLastUpdt IS ", formattedLastUpdt)
    console.log("formattedNowTime IS ", formattedNowTime)
    const duration = moment.duration(formattedNowTime.diff(formattedLastUpdt))
    const hours = duration.asHours()
    const timePassed = parseFloat(hours.toFixed(2))
    console.log("HOURS PASSED SINCE LAST UPDATE ::", timePassed)
    if (xHours < timePassed) { return true }
    return false

}

export const getLastUpdateTime = async (username: string) => {

    const beforeUpdateBalanceDTO = await retrieveBalanceDTO(username)
    if (beforeUpdateBalanceDTO !== null) {
        return beforeUpdateBalanceDTO!.updatedAt
    }
    console.error("getLastUpdateTime returned null")
    return null
}
export const retrieveInfoDTO = async (username: string) => {
    const start = moment({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
    })
    const end = moment({
        year: 2022,
        month: 2,
        day: 30
    })
    const doc: any = await UserRepo.
        Info.findOne({ username: username }).exec()
    // console.info('Retrived infoDoc from MongoDB ::', doc)

    if (doc === null) {
        return null
    } else {
        const lean = await getLean(username, doc.accounts[0].balance, start, end)
        const days = countDaysDifference(start, end)
        const Gasdebt = 234.15 //decrease dao from 330 to 100 , so debt is 60
        const safetyBuffer = 100
        const transport = 22 * 2
        const myTaxes = Gasdebt + safetyBuffer + transport
        const InfoDTO: UserInfoResultDoc = {
            _id: doc._id,
            nextIncome: {
                amount: doc.salary.amount,
                daysleft: days,
                weeksLeft: parseFloat((days / 7).toFixed(2))
            },
            balance: {
                gross: doc.accounts[0].balance,
                netto: parseFloat((lean - myTaxes).toFixed(3))
            },
            maxPerDay: parseFloat(((lean - myTaxes) / days).toFixed(2)),
            maxPerWeek: parseFloat((((lean - myTaxes) / days) * 7).toFixed(2)),
            willBeSaved: safetyBuffer
        }
        return InfoDTO
    }

}
export const getLean = async (username: string, grossBalance: number, start: moment.Moment, end: moment.Moment) => {
    const res = await GetSumBillsInADuration(username, start, end)
    return grossBalance - res
}
export const countDaysDifference = (beginDate: moment.Moment, endDate: moment.Moment
) => {
    const duration = moment.duration(endDate.add(1, 'day').diff(beginDate))
    // console.info("Diff", duration.asDays())
    return Math.round(duration.asDays())
}
interface UserInfoResultDoc {
    _id: string,
    nextIncome: {
        amount: number,
        daysleft: number,
        weeksLeft: number
    },
    balance: {
        gross: number,
        netto: number
    },
    maxPerDay: number,
    maxPerWeek: number,
    willBeSaved: number,
}
export const retrieveBalanceDTO = async (username: string) => {

    const doc: any = await BalanceRepo.
        Balance.findOne({ username: username }).exec()
    console.info('Retrived BalanceDoc from MongoDB ::', doc)

    if (doc === null) {
        return null
    } else {
        const BalanceDTO: BalanceDocResult = {
            _id: doc._id,
            amount: doc.amount,
            username: doc.username,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }
        return BalanceDTO
    }

}

interface BalanceDocResult {
    _id: any,
    amount: string,
    username: string,
    createdAt: string,
    updatedAt: string
}

export const flowSim = async () => { //param _username: string
    //Get username from query param
    const username = "amddev"
    //Get Balance Doc, 

    //to check how recent the balance data is
    // 2022-02-10T14:29:23.462+00:00
    const lstUpdateTime = await getLastUpdateTime('amddev')
    const refresh = shouldIRefresh(1, moment().format(), lstUpdateTime!)// '2022-02-10T13:29:23.462+00:00'

    if (refresh === true) {
        console.log("REFRESHING FROM BANK")
        let access_token = await nordigen.requestJWT()
        let newBalance = await nordigen.requestBalance(access_token)
        console.log('New Balance received! ::' + newBalance)
        //Update collection 
        await updateBalanceDocument(newBalance, username)
        await updateBalanceInUserInfoDocument(newBalance, username)
    }
    else {
        console.log("NOT GONNA REFRESH")
    }

}

export const getBalanceFromBank = async () => {
    let access_token = await nordigen.requestJWT()
    let newBalance = await nordigen.requestBalance(access_token)

    return newBalance
}

//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = async (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.query.username)
    const username = req.params.username as string

    const lstUpdateTime = await getLastUpdateTime('amddev')
    const refresh = shouldIRefresh(8, moment().format(), lstUpdateTime!)
    if (refresh === true) {
        console.log("REFRESHING FROM BANK")
        let access_token = await nordigen.requestJWT()
        let newBalance = await nordigen.requestBalance(access_token)
        console.log('New Balance received! ::' + newBalance)
        //Update collection 
        await updateBalanceDocument(newBalance, username)
        await updateBalanceInUserInfoDocument(newBalance, username)
    }
    else {
        console.log("NO DB REFRESH REQUIRED; SKIPPING CALLKING THE BANK")
    }


    const dto = await retrieveInfoDTO(username)

    console.info("User new info", dto)



    return res.status(200).json(dto)

}

//CHeck if user exists in db manually, add try catch 
export const updateBalanceDocument = async (_amount: string, _username: string) => {

    const filter = { username: _username }
    const update = { amount: _amount }
    let doc = await BalanceRepo.Balance.findOneAndUpdate(filter, update, {
        new: true
    })
    console.log(doc)
}

//619ccb47714cfd0cb3bb4136 accId
export const updateBalanceInUserInfoDocument = async (_amount: string, _username: string) => {
    const filter = { "username": _username, "accounts.accountType": 'main' }
    const update = { $set: { "accounts.$.balance": _amount } }
    let doc = await UserRepo.Info.findOneAndUpdate(filter, update, {
        new: true
    })
    // console.log(doc)
    return doc

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
    createOneUserInfo,
    UpdateOneUserInfo
}




