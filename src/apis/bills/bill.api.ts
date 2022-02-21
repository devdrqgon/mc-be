import { Request, Response } from "express";
import moment from "moment";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import { UserRepo } from "../../persistence/user/user.schemas";
import mongoose from 'mongoose';



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
interface BillsInfo {
    paid: Bill[]
    notYet: Bill[]
}


export const GetBillsInfo = async (req: Request, res: Response) => {
    const dto: BillsInfo = {
        paid: [
            // await getPaidBills()
        ],
        notYet: [

        ]
    }
    return res.status(200).json(dto)
}

interface Mapper {
    billMCname:string,
    billBankName: string
    when:{
        on:number|null,
        range:Range | null
    }
}
interface Range {
    begin:number,
    end:number
}
interface Transaltion{
    billMCname:string,
    billBank: {
        creditorName:string,
        amount:number,
        valueDate: string
    }
}
const createNewBillsCollection =  async (username:string)=> {
    const _transaltion :Transaltion[]= [
        {
            billMCname:"audible",
            billBank: {
                creditorName:"AUDIBLE GMBH",
                amount:-9.95,
                valueDate: "2022-01-18"
            }
        }
    ]
    const bills = await getBillsOfUserFromDB(username)
    let mappedBills : Mapper[]=[]
    bills.forEach(element => {
        mappedBills.push({
            billBankName: 
        })
    
        var BookSchema = new mongoose.Schema({
            name: String,
            price: Number,
            quantity: Number
        });
       
          // compile schema to model
          var Book = mongoose.model('Book', BookSchema, 'bookstore');
       
          // a document instance
          var book1 = new Book({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });
       
          // save model to database
          book1.save(function (err, book) {
            if (err) return console.error(err);
            console.log(book.name + " saved to bookstore collection.");
          });
      
    });
}
const GetUnpaidBillsINaDuration = async (username: string, start: moment.Moment, end: moment.Moment) => {
    /**
    * The idea is to get the transactions from bank, and look for predefined transactions,
    *  which their names and amount matches the user's bills 
    */

    //1.Get user Bills 
    const bills = await getBillsOfUserFromDB(username)

    //2.Get all bills in the duration 
    const billsWithRecurrence = await getBillsRecurrenceInADuration(bills, start, end)

    //3filter the Unpaid Bills 
    //3.a refresh duration transactions from bank, if necessary
          
    //3.b check if bill B is included in the transactions 

    //return the unpaid bills with recurrence 
}
export const getBillsRecurrenceInADuration = (bills: Bill[], start: moment.Moment, end: moment.Moment) => {
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
    })
    return analyzedBillS
}



export const GetSumBillsInADuration = async (username: string, start: moment.Moment, end: moment.Moment) => {

    //get user bills 
    const bills = await getBillsOfUserFromDB(username)
    const analyzedBillS = getBillsRecurrenceInADuration(bills, start, end)
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

