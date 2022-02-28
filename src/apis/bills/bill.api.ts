import e, { Request, Response } from "express";
import moment from "moment";
import { stringify } from "querystring";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import nordigen, { TransactionConverted } from "../../infrastructure/nordigenAdapter";
import { UserRepo } from "../../persistence/user/user.schemas";
import { getLastUpdateTime, shouldIRefresh } from "../userInfos/info.api";
import InMemoryBills from './data'
import { v4 as uuidv4, v4 } from 'uuid'


export const updateBill = (req: Request, res: Response) => {
    const billId = req.params.id as string
    const {
        username: username, cost: reqCost,
        when: reqWhen, paid: reqPaid,
        billName: reqBillName
    } = req.body

    UserRepo.Info.findOneAndUpdate(
        { "username": username, "bills._id": billId },
        { $set: { "bills.$.paid": reqPaid } },
        (error: any, data: any) => {
            if (error) {
                console.error(error)
            } else {
                return res.status(200).json('ok')

            }
        })

}


export const getTimesAlreadyPaidWithcreditorNameOnly = (creditorName: string, transactions: Array<Jso>) => {
    let times = 0
    transactions.forEach(t => {
        if (t.creditorName) {
            if (t.creditorName.replace(/\s+/g, '') == creditorName.replace(/\s+/g, '')) {
                times = times + 1
            }
        }
    })
    return times
}

export const getTimesAlreadyPaidWithRISandPrice = (ris: string, cost: number, transactions: Array<Jso>) => {
    let times = 0
    transactions.forEach(t => {
        if (t.remittanceInformationStructured!.replace(/\s+/g, '') == ris.replace(/\s+/g, '')
            &&
            (cost + t.amount === 0.0)) {
            times = times + 1
        }
    })
    return times
}

export const getTimesAlreadyPaidWithRISonly = (ris: string, transactions: Jso[]) => {
    let times = 0
    transactions.forEach(t => {
        if (t.remittanceInformationStructured!.replace(/\s+/g, '') == ris.replace(/\s+/g, '')) {
            times = times + 1
        }
    })
    return times
}
export const getYetToBePaid = (when: {
    start: number;
    end: number;
}, planEnd: moment.Moment) => {
    const now = moment({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
    })

    //e.g bill happens between 15 and 17
    //e.g plan ends 30.02
    //e.g today is 12.02

    const nbOfMonths = countMonths(now, planEnd)
    if (nbOfMonths === 1) {
        if (when.start > now.date() && when.end < planEnd.date()) {
            return 1
        }
    }
    //e.g bill happens between 28 and 2
    //e.g plan ends 30.02
    //e.g today is 28.01

    if (nbOfMonths === 2) {
        if (when.start > now.date() && when.end < planEnd.date()) {
            return 1
        }
    }
    const firstOccurence: null | moment.Moment = moment({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
    })
}

export type Jso = { remittanceInformationStructured: string; amount: number; creditorName: string; } | { amount: number; remittanceInformationStructured?: undefined; creditorName?: undefined; } | { remittanceInformationStructured: string; amount: number; creditorName?: undefined; }

// export const analyzecreditorNameNoPrice = (start: moment.Moment, end: moment.Moment, transactions: Array<Jso>) => {
//     let analyzedBillS: AnalyzedBill[] = []

//     InMemoryBills.creditorNameNoPrice.forEach(b => {
//         //Get recurrence 
//         // const recurrs = getReccurenceBill(start, end, b.when)
//         const now = moment({
//             year: moment().year(),
//             month: moment().month(),
//             day: moment().date(),
//         })

//         //get already paid 
//         // const timesAlreadyPaid = getTimesAlreadyPaidWithcreditorNameOnly(b.creditorName, transactions)
//         // const yetToBePaid = getYetToBePaid(b.when, now, end)
//         // //
//         const dto: AnalyzedBill = {
//             idRef: uuidv4(), //! HMM
//             amount: b.amount,
//             name: b.friendlyName,
//             when: b.when,
//             yetToBePaid: 3,
//             paymentsLeft: 1
//         }
//         analyzedBillS.push(dto)
//     })
//     console.info("analyzecreditorNameNoPrice::", analyzedBillS)
//     return analyzedBillS
// }
// export const generateBillsAnalysis = async (jwt: string, username: string, start: moment.Moment, end: moment.Moment) => {
//     //Get User Transaction 
//     const transactions = await nordigen.getTransactions(jwt, start)
//     //get user bills 
//     // const bills = await getBillsOfUserFromDB(username)

//     let analyzedBillS: AnalyzedBill[] = []



//     const creditorNameNoPrice = analyzecreditorNameNoPrice(start, end, transactions)
//     analyzedBillS.concat(creditorNameNoPrice)
//     InMemoryBills.risAndPrice.forEach(b => {
//         //Get recurrence 
//         const recurrs = getReccurenceBill(start, end, b.when)

//         //get already paid 
//         const timesAlreadyPaid = getTimesAlreadyPaidWithRISandPrice(b.remittanceInformationStructured, b.amount, transactions)

//         //
//         const dto: AnalyzedBill = {
//             idRef: uuidv4(), //! HMM
//             amount: b.amount,
//             name: b.friendlyName,
//             when: b.when,
//             yetToBePaid: 3,
//             paymentsLeft: recurrs - timesAlreadyPaid
//         }
//         analyzedBillS.push(dto)
//     })
//     InMemoryBills.manualBills.forEach(b => {
//         //Get recurrence 
//         const recurrs = getReccurenceBill(start, end, b.when)

//         //get already paid 
//         const timesAlreadyPaid = getTimesAlreadyPaidWithRISonly(b.remittanceInformationStructured, transactions)

//         //
//         const dto: AnalyzedBill = {
//             idRef: uuidv4(), //! HMM
//             amount: b.amount,
//             name: b.friendlyName,
//             when: b.when,
//             yetToBePaid: 6,
//             paymentsLeft: recurrs - timesAlreadyPaid
//         }
//         analyzedBillS.push(dto)
//     })
//     //rent 
//     //Get recurrence 
//     const recurrs = getReccurenceBill(start, end, InMemoryBills.rent.when)

//     //get already paid 
//     const timesAlreadyPaid = getTimesAlreadyPaidWithcreditorNameOnly(
//         InMemoryBills.rent.creditorName,
//         transactions)

//     analyzedBillS.push({
//         idRef: uuidv4(), //! HMM
//         amount: InMemoryBills.rent.amount,
//         name: InMemoryBills.rent.friendlyName,
//         when: InMemoryBills.rent.when,
//         yetToBePaid: 5,
//         paymentsLeft: recurrs - timesAlreadyPaid
//     })

//     console.info("_analyzedBills::", analyzedBillS)

//     return analyzedBillS
// }
interface AnalyzedBill {
    idRef: string,
    name: string,
    amount: number,
    when: {
        start: number,
        end: number
    },
    yetToBePaid: number,
    paymentsLeft: number
}


/**
 * 
 * @param beginDate 28.01
 * @param endDate 30.03
 * @returns  3
 */

const countMonths = (beginDate: moment.Moment, endDate: moment.Moment) => {
    var interim = beginDate.clone();
    let nbOfMonths = 1

    while (interim.format('M') !== endDate.format('M')) {

        nbOfMonths++
        interim.add(1, 'month');
    }
    return nbOfMonths
}

export function getReccurenceBill(beginDate: moment.Moment, endDate: moment.Moment, billDate: {
    start: number,
    end: number
}) {

    /**
        * create dates then ask timespan
        * planstart 20.02
        * end 23.03
        * bill on 19 of every month
        * rec:  3
        */
    //how many months?
    // const nbOfMonths = countMonths(beginDate, endDate)
    // let recurrence = 0

    // if (nbOfMonths === 1) {
    //     if (billDate.start > beginDate.date() && billDate.end < endDate.date()) {
    //         return 1
    //     }
    //     return 0
    // }
    // if (nbOfMonths === 2) {
    //     if (beginDate.date() < billDate.start) {
    //         recurrence++
    //     }
    //     if (endDate.date() > billDate.end) {
    //         recurrence++
    //     }
    //     return recurrence
    // }
    // else {
    //     const _nbMnths = nbOfMonths - 2
    //     if (beginDate.date() < billDate.start) {
    //         recurrence++
    //     }
    //     if (endDate.date() > billDate.end) {
    //         recurrence++
    //     }
    //     return recurrence + _nbMnths
    // }

    return 0
}

export function calculateSum(billsAnalyzed: AnalyzedBill[]) {

    let sum = 0

    billsAnalyzed.forEach(b => {
        sum = sum + (b.amount * b.paymentsLeft)
    })
    return sum

}

export const getBillsOfUserFromDB = async (username: string) => {
    const bills = await UserRepo.Info.find({ username })
        .select('bills')
        .exec()
        .then((bills: any) => {
            //  console.info(bills)
            return bills;
        })
        .catch((err) => {
            logging.error("[billsAPI]", err.message, err);

            return null;
        })
    return bills[0].bills as Bill[]


}


