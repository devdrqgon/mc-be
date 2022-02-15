import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging"
import nordigen from "../../infrastructure/nordigenAdapter"
import IBalanceDoc from "../../persistence/balance/balance.docs"
import { BalanceRepo } from "../../persistence/balance/balance.schemas"
import { UserRepo } from "../../persistence/user/user.schemas"
import moment from 'moment'

const namespace = "CONTROLLER:[USERINFO]"

const getAllUserInfos = (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get all UserInfos..", req.body)

}





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

//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = async (req: Request, res: Response) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.query.username)
    const username = req.params.username as string

    const lstUpdateTime = await getLastUpdateTime('amddev')
    const refresh = shouldIRefresh(8, moment().format(), lstUpdateTime!)
    // if (refresh === true) {
    //     console.log("REFRESHING FROM BANK")
    //     let access_token = await nordigen.requestJWT()
    //     let newBalance = await nordigen.requestBalance(access_token)
    //     console.log('New Balance received! ::' + newBalance)
    //     //Update collection 
    //     await updateBalanceDocument(newBalance, username)
    //     await updateBalanceInUserInfoDocument(newBalance, username)
    // }
    // else{
    //     console.log("NO DB REFRESH REQUIRED; SKIPPING CALLKING THE BANK")
    // }



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

//CHeck if user exists in db manually 
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
    getAllUserInfos,
    createOneUserInfo,
    UpdateOneUserInfo
}


// if (true) {
//     UserRepo.Info.find({ username })
//         .select('-updatedAt')
//         .select('-createdAt')
//         .select('-_id')
//         .exec()
//         .then((usrInfo) => {

//             return res.status(200).json({ usrInfo })
//         })
//         .catch((err) => {
//             logging.error("[userInfoAPI]", err.message, err)

//             return res.status(409).json({ message: 'no user info found' })
//         })
// }
// else{
//     // Balance is old, update from NordigenAPI 
//     //Get new balance from NordigenAPI 
//     let newBalance =  await nordigen.requestBalance()

//     //Update db
//     BalanceRepo.Balance.findOneAndUpdate(
//         { "username": username },
//         { $set: { "amount": newBalance } },
//         (error: any, data: any) => {
//             if (error) {
//                 console.error(error)
//             } else {
//                 return res.status(200).json({data})

//             }
//         })
// }   

const periodLength = 5 //days
const DailyBudget = (nbrOfDays: number, moneyAvailable: number) => {
    return moneyAvailable / nbrOfDays
}


const BudgetPerPeriod = (nbrOfDays: number, moneyAvailable: number) => {
    return DailyBudget(nbrOfDays, moneyAvailable) * periodLength
}

/**
 * 
 * we divide the length of the survival mission in periods, so that we have  milestones 
 * 
 */
const NbrOfPeriods = (nbrOfDays: number) => {
    if (nbrOfDays / periodLength)
        return nbrOfDays / periodLength
}

const MoneyLowerBound = (nbOfRemainingDays: number, dailyBudget: number) => {
    return dailyBudget * nbOfRemainingDays

}
const isTheMoneyEnough = (dailyBudget: number, moneyAvailable: number, nbOfRemainingDays: number) => {
    // Maybe we add ma7zou9DailyBudget, ma7loul daily Budget.. 

    //Current money (moneyAvailable) should always be greater than MoneyLowerBound
    let _moneyLowerBound = MoneyLowerBound(nbOfRemainingDays, dailyBudget)
    if (_moneyLowerBound > moneyAvailable) {
        return false
    }
    return true

}

const canISaveXEur = (XEur: number, nbOfRemainingDays: number, dailyBudget: number, moneyAvailable: number) => {
    let _moneyLowerBound = MoneyLowerBound(nbOfRemainingDays, dailyBudget)

    if (_moneyLowerBound < (moneyAvailable + XEur)) {
        return true
    }
    return false
}
//MC must remind user to not exceed period budget

/**
 * 
 * as a user i want to create a goal 
 * 
 * i want to survive with 2700 till 31 March 
 *  MC: your DailyBudget()
 * 
 * 
 */