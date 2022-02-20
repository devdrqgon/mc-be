import { Request, Response } from "express";
import moment from "moment";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import { UserRepo } from "../../persistence/user/user.schemas";



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


export const GetSumBillsInADuration = async (username: string, start: moment.Moment, end: moment.Moment) => {

    //get user bills 
    const bills = await getBillsOfUserFromDB(username)
    let analyzedBillS: AnalyzedBill[] = []
    bills.forEach(b => {

        const dto: AnalyzedBill = {
            idRef: b._id,
            amount: b.cost,
            name: b.billName,
            recurrs: getReccurenceBill(start, end, b.when),
            when: b.when
        }
        analyzedBillS.push(dto)
    });
    //prepare billsAnalysis, to calculate sum
    //calculate sum
    console.info("_analyzedBills::", analyzedBillS)

    const sum = calculateSum(analyzedBillS)

    console.info("Sum of Bills::", sum)
    return sum
}
interface AnalyzedBill {
    idRef: string,
    name: string,
    amount: number,
    recurrs: number,
    when: number
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

function calculateSum(billsAnalyzed: AnalyzedBill[]) {

    let sum = 0

    billsAnalyzed.forEach(b => {
        sum = sum + (b.amount * b.recurrs)
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

