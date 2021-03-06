import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging"
import nordigen, { getTransactions } from "../../infrastructure/nordigenAdapter"
import IBalanceDoc from "../../persistence/balance/balance.docs"
import { BalanceRepo } from "../../persistence/balance/balance.schemas"
import { NewBill, UserRepo } from "../../persistence/user/user.schemas"
import moment from 'moment'
import { calculateSum, getBillsOfUserFromDB, Jso } from "../bills/bill.api"
import { sumOfEverything, sumOfUnpaid } from "../bills/data"
import fs from 'fs'

const namespace = "CONTROLLER:[USERINFO]"

// 2022-02-10 T 16:04:51+01:00
// 2022-02-10 T15:29:23+01:00
export const shouldIRefresh = (xHours: number, _nowTime: string, _lastUpdateTime: string) => {

    //FormatDate 
    const formattedLastUpdt = moment(_lastUpdateTime)
    const formattedNowTime = moment(_nowTime)
    console.log("formattedLastUpdt IS ", formattedLastUpdt.format('HH-MM-SS'))
    console.log("formattedNowTime IS ", formattedNowTime)
    const duration = moment.duration(formattedNowTime.diff(formattedLastUpdt))
    const hours = duration.asHours()
    const timePassed = parseFloat(hours.toFixed(2))
    console.log("HOURS PASSED SINCE LAST UPDATE ::", timePassed)
    if (xHours < timePassed) { return true }
    else {
        return false

    }

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
    const end = moment("2022-04-30")
    const doc: any = await UserRepo.
        NewInfo.findOne({ username: username }).exec()
    // console.info('Retrived infoDoc from MongoDB ::', doc)

    if (doc === null) {
        return null
    } else {
        let access_token = await nordigen.requestJWT()

        const grossbalance = doc.accounts[0].balance
        const lean = await getLean(access_token, username, grossbalance, start, end)
        const days = countDaysDifference(start, end)
        const myTaxes = 0
        const netto = parseFloat((lean - myTaxes).toFixed(3))

        const _bills = await getBillsOfUserFromDB(username)

        const InfoDTO: UserInfoResultDoc = {
            _id: doc._id,
            nextIncome: {
                amount: doc.salary.amount,
                daysleft: days,
                weeksLeft: parseFloat((days / 7).toFixed(2))
            },
            balance: {
                gross: grossbalance,
                netto
            },
            maxPerDay: parseFloat((netto / days).toFixed(2)),
            maxPerWeek: parseFloat(((netto / days) * 7).toFixed(2)),
            willBeSaved: 0,
            bills: {
                bills: _bills.normalBills,
                manualBills: _bills.manualBills,
                paypalBills: _bills.paypalBills
            }
        }
        return InfoDTO
    }

}
export const getLean = async (jwt: string, username: string, grossBalance: number, start: moment.Moment, end: moment.Moment) => {
    const _bills = await getBillsOfUserFromDB(username)
    let sumOfUnpaid = 0
    sumOfUnpaid = _bills.manualBills.filter(b => b.paid === false).reduce((partialSum, a) => partialSum + a.amount, 0);
    sumOfUnpaid = sumOfUnpaid + _bills.paypalBills.filter(b => b.paid === false).reduce((partialSum, a) => partialSum + a.amount, 0);
    sumOfUnpaid = sumOfUnpaid + _bills.manualBills.filter(b => b.paid === false).reduce((partialSum, a) => partialSum + a.amount, 0);

    // console.info("Sum of Bills::", sum)
    return grossBalance - sumOfUnpaid
}
export const countDaysDifference = (beginDate: moment.Moment, endDate: moment.Moment
) => {
    const duration = moment.duration(endDate.add(1, 'day').diff(beginDate))
    // console.info("Diff", duration.asDays())
    return Math.round(duration.asDays())
}
interface FeBill {
    _id: string,
    _friendlyName: string,
    _amount: number,
    paid: boolean
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
    bills: {
        bills: NewBill[],
        paypalBills: NewBill[],
        manualBills: NewBill[],
    }
}
export const retrieveBalanceDTO = async (username: string) => {

    const doc: any = await BalanceRepo.
        Balance.findOne({ username: username }).exec()
    // console.info('Retrived BalanceDoc from MongoDB ::', doc)

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
    const refresh = shouldIRefresh(4, moment().format(), lstUpdateTime!)// '2022-02-10T13:29:23.462+00:00'

    if (refresh === true) {
        console.log("REFRESHING FROM BANK")
        let access_token = await nordigen.requestJWT()
        let newBalance = await nordigen.requestBalance(access_token)
        console.log('New Balance received! ::' + newBalance)
        //Update Interim  collection
        await updateBalanceDocument(newBalance!, username)

        //UPdate Transactions collection
        await updateBalanceInUserInfoDocument(newBalance!, username)
    }
    else {
        console.log("NOT GONNA REFRESH")
    }

}

export const getBalanceFromBankTester = async () => {
    let access_token = await nordigen.requestJWT()
    let newBalance = await nordigen.requestBalance(access_token!)

    return newBalance
}
export const getTransactionsFromBankTester = async () => {
    const start = moment({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
    })

    let access_token = await nordigen.requestJWT()
    const BankTransactions = await nordigen.getTransactions(access_token!, start)

    return BankTransactions
}
//Create a middleware that verifies if the user Account exists in db
const getOneUserInfo = async (req: Request, res: Response) => {
    console.info("I  M HIT")
    logging.info(`CONTROLLER:${namespace}`, "attempting to get user info..", req.query.username)
    const username = req.params.username as string

    const lstUpdateTime = await getLastUpdateTime('amddev')
    const refresh = shouldIRefresh(0, moment().format(), lstUpdateTime!)
    if (refresh === true) {
        console.log("REFRESHING FROM BANK")
        let access_token = await nordigen.requestJWT()
        let newBalance = await nordigen.requestBalance(access_token)
        console.log('New Balance received! ::' + newBalance)
        //Update Bills 
        await updateBills(username)
        //Update Balance 
        await updateBalanceDocument(newBalance!, username)
        await updateBalanceInUserInfoDocument(newBalance!, username)

    }
    else {
        console.log("NO DB REFRESH REQUIRED; SKIPPING CALLKING THE BANK")
    }


    const dto = await retrieveInfoDTO(username)

    // console.info("User new info", dto)



    return res.status(200).json(dto)

}

export const updateBills = async (_username: string) => {
    //Get Bills from db
    const _bills = await getBillsOfUserFromDB(_username)
    //Get Transactions from the beggning of the month 
    const _transactions = await getTransactions(await nordigen.requestJWT(), moment({
        year: moment().year(),
        month: moment().month(),
        day: 1
    }))

    // let jsonContent = JSON.stringify(_transactions);

    //     fs.writeFile("Newtransactions.json", jsonContent, 'utf8', function (err) {
    //         if (err) {
    //             console.log("An error occured while writing JSON Object to File.");
    //             return console.log(err);
    //         }

    //         console.log("JSON file has been saved.");
    //     });
    _bills.normalBills.filter(o => o.paid === false && o.billType === 'creditorName').forEach(b => {
        _transactions.forEach(t => {
            if (t.creditorName !== undefined) {
                if (removeSpacesFromString(b.bankText) === removeSpacesFromString(t.creditorName)) {
                    //  console.log("BILL FOUND IN BANK",b.friendlyName)
                    _bills.normalBills.find(k => k.friendlyName === b.friendlyName)!.paid = true
                }
            }
        })
    })

    _bills.normalBills.filter(o => o.paid === false && o.billType === 'remittanceInformationStructured').forEach(b => {
        _transactions.forEach(t => {
            if (t.remittanceInformationStructured !== undefined) {
                if (
                    removeSpacesFromString(b.bankText) === removeSpacesFromString(t.remittanceInformationStructured)

                ) {
                    if ((t.amount * -1) === b.amount) {
                        console.log("BILL FOUND IN BANK", b.friendlyName)
                        _bills.normalBills.find(k => k.friendlyName === b.friendlyName)!.paid = true
                    }
                    else {
                        // console.info(`found transaction for ${b.friendlyName} , ${b.amount} but price did not match`, t.amount * -1)

                    }

                }
            }
        })
    })

    // console.info("_bill", _bills.normalBills)

}

const BillFound = (b: NewBill, _transactions: Jso[]) => {
    _transactions.forEach(t => {
        if (t.creditorName !== undefined) {
            if (removeSpacesFromString(b.bankText) === removeSpacesFromString(t.creditorName)) {
                console.log("BILL FOUND IN BANK", b.friendlyName)
                return true
            }
        }
    })
    return false
    // else {
    //     _transactions.forEach(t => {
    //         if (t.remittanceInformationStructured) {
    //             if (removeSpacesFromString(t.remittanceInformationStructured) === removeSpacesFromString(b.bankText)) {
    //                 return true
    //             }
    //             else {

    //             }
    //         }
    //     })
    //     return false
    // }
}

// 20mm
// 3.8mm

const removeOneSpace = (_str: string) => {
    let index = _str.indexOf(" ")
    let begin = _str.substring(0, index)
    let end = _str.substring(index + 1)
    return begin.concat(end)
}
export const removeSpacesFromString = (_str: string): string => {
    if (_str.indexOf(" ") === -1) {
        return _str
    } else {
        return removeSpacesFromString(removeOneSpace(_str))
    }
}
//CHeck if user exists in db manually, add try catch 
export const updateBalanceDocument = async (_amount: number, _username: string) => {

    const filter = { username: _username }
    const update = { amount: _amount.toString() }
    let doc = await BalanceRepo.Balance.findOneAndUpdate(filter, update, {
        new: true
    })
    console.log(doc)
}

//619ccb47714cfd0cb3bb4136 accId
export const updateBalanceInUserInfoDocument = async (_amount: number, _username: string) => {

    //are there any to be booked transactions ?
    //const interim = await nordigen.interim()
    const update = { $set: { "accounts.$.balance": _amount } }
    const filter = { "username": _username, "accounts.accountType": 'main' }

    let doc = await UserRepo.NewInfo.findOneAndUpdate(filter, update, {
        new: true
    })
    // console.log(doc)
    return doc

}

// const createOneUserInfo = (req: Request, res: Response) => {
//     logging.info(`CONTROLLER:${namespace}`, "attempting to create UserInfo..", req.body)

//     const {
//         username: reqUsername, salary: reqSalary,
//         dayOfMonthOfSalary, weeklyBudget: reqWeeklyBudget,
//         bills: reqBills, accounts: reqAccounts
//     } = req.body



//     const _userInfoDoc = new UserRepo.NewInfo({
//         id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
//         username: reqUsername,
//         salary: reqSalary,
//         dayOfMonthOfSalary: dayOfMonthOfSalary,
//         bills: reqBills,
//         accounts: reqAccounts,
//         weeklyBudget: reqWeeklyBudget

//     })

//     //Save it!


//     return _userInfoDoc.save()
//         .then((info: any) => {
//             logging.info(`CONTROLLER:${namespace}`, " UserInfo Created..", info)

//             res.status(201).json({ info })
//         })
//         .catch((error: any) => {
//             logging.error(`CONTROLLER:${namespace}`, " UserInfo POST Failed..", error)

//             res.status(500).json({
//                 message: error.message,
//                 error
//             })
//         })

// }

// const UpdateOneUserInfo = () => { }




export default {
    getOneUserInfo
}




