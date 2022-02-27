import { Request, Response } from "express";
import moment from "moment";
import { stringify } from "querystring";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import nordigen, { TransactionConverted } from "../../infrastructure/nordigenAdapter";
import { UserRepo } from "../../persistence/user/user.schemas";
import { getLastUpdateTime, shouldIRefresh } from "../userInfos/info.api";
import InMemoryBills from './data'


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
/**
 *  gets recognized by remittanceInformationStructured
 * 
 * GetSafe???? 
  * 
 * remittanceInformationStructured && Price 
 *  #Paypal zahlungen
 *  #Barmenia
 * 
 *  
 * 
*/
 
export const getTimesAlreadyPaid = (b: Bill, transactions: TransactionConverted[]) => {
    let times = 0
    transactions.forEach(t => {
        if (t.remittanceInformationStructured.replace(/\s+/g, '') == b.NameInBankAccount.replace(/\s+/g, '')) {
            times = times + 1
        }
    })
    return times
}
 
export const generateBillsAnalysis = async (jwt: string, username: string, start: moment.Moment, end: moment.Moment) => {
    //Get User Transaction 
    const transactions = await nordigen.getTransactions(jwt, start)
    //get user bills 
    // const bills = await getBillsOfUserFromDB(username)
     
    let analyzedBillS: AnalyzedBill[] = []



    InMemoryBills.CreditorNameNoPrice.forEach(b => {
        //Get recurrence 
        
        //get already paid 
    })
    //get userTransactions
    //const transactions: any[] = getUserTransactions(username)
    bills.forEach(b => {
        const recurrs = getReccurenceBill(start, end, b.when)
        const timesAlreadyPaid = getTimesAlreadyPaid(b, transactions)
        const dto: AnalyzedBill = {
            idRef: b._id,
            amount: b.cost,
            name: b.billName,
            when: b.when,
            paymentsLeft: recurrs - timesAlreadyPaid
        }
        analyzedBillS.push(dto)
    });
    //prepare billsAnalysis, to calculate sum
    //calculate sum
    console.info("_analyzedBills::", analyzedBillS)

    return analyzedBillS
}
interface AnalyzedBill {
    idRef: string,
    name: string,
    amount: number,
    when: number,
    paymentsLeft: number
}




const countMonths = (beginDate: moment.Moment, endDate: moment.Moment) => {
    var interim = beginDate.clone();
    let nbOfMonths = 0

    while (endDate > interim || interim.format('M') === endDate.format('M')) {

        nbOfMonths++
        interim.add(1, 'month');
    }
    return nbOfMonths
}

export function getReccurenceBill(beginDate: moment.Moment, endDate: moment.Moment, billDate: number) {

    /**
        * create dates then ask timespan
        * planstart 20.02
        * end 23.03
        * bill on 19 of every month
        * rec:  3
        */
    //how many months?
    const nbOfMonths = countMonths(beginDate, endDate)
    let recurrence = 0

    if (nbOfMonths === 1) {
        if (billDate > beginDate.date() && billDate < endDate.date()) {
            return 1
        }
        return 0
    }
    if (nbOfMonths === 2) {
        if (beginDate.date() < billDate) {
            recurrence++
        }
        if (endDate.date() > billDate) {
            recurrence++
        }
        return recurrence
    }
    else {
        const _nbMnths = nbOfMonths - 2
        if (beginDate.date() < billDate) {
            recurrence++
        }
        if (endDate.date() > billDate) {
            recurrence++
        }
        return recurrence + _nbMnths
    }


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


