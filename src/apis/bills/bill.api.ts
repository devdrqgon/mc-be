import { NextFunction, Request, Response } from "express";
import moment, { Moment } from "moment";
import mongoose from 'mongoose'
import { userInfo } from "os";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import { IUserInfoDoc } from "../../persistence/user/user.docs";
import { UserRepo } from "../../persistence/user/user.schemas";
import { v4 as uuidv4 } from 'uuid';

const getAllBillsOfOneUser = (req: Request, res: Response) => {
    //get username from request param
    const username = req.params.username as string

    //get only bills sub collection from userInfoCollection  

    UserRepo.Info.find({ username })
        .select('bills')
        .exec()
        .then((bills) => {
            return res.status(200).json({ bills: bills })
        })
        .catch((err) => {
            logging.error("[billsAPI]", err.message, err)

            return res.status(409).json({ message: 'get bills error' })
        })
}

const updateBill = (req: Request, res: Response) => {
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

//from fe
export const countDaysDifference = (beginDate: moment.Moment, endDate: moment.Moment
) => {
    const duration = moment.duration(endDate.diff(beginDate))
    console.info("Diff", duration.asDays())
    return duration.asDays()
}
const getSumAllBillsOfOneUserInADuration = async (req: Request, res: Response) => {
    const beginDate = req.params.beginDate as string
    const endDate = req.params.endDate as string
    const username = req.params.username as string
    const formattedBeginDate = moment(beginDate)
    const formattedEndDate = moment(endDate)

    //get user bills 
    const bills = await getBillsOfUserFromDB(username)
    //prepare billsAnalysis
    // const _analyzedBills = analyzeBills(bills!, formattedBeginDate, formattedEndDate)
    //calculate sum

    // const sum = calculateSum(_analyzedBills)
    const dto = {
        // sum
    }
    return res.status(200).json(dto)

}
export const GetSumBillsInADuration = async (username: string,start: moment.Moment,end: moment.Moment) => {
    
    //get user bills 
    const bills = await getBillsOfUserFromDB(username)
    let analyzedBillS: AnalyzedBill[] = []
    bills.forEach(b => {

        const dto: AnalyzedBill = {
            idRef: b._id,
            amount: b.cost,
            name: b.billName,
            recurrs: getReccurenceBill2(start, end, b.when),
            when: b.when
        }
        analyzedBillS.push(dto)
    });
    //prepare billsAnalysis, to calculate sum
    //calculate sum
    console.info("_analyzedBills::", analyzedBillS)

    const sum = calculateSum(analyzedBillS)

    console.info("Sum of Bills::",sum)
    return sum
}
interface AnalyzedBill {
    idRef: string,
    name: string,
    amount: number,
    recurrs: number,
    when: number
}



const _billsWithRec = [
    {
        idRef: "619ccb47714cfd0cb3bb4122",
        amount: 9.95,
        name: 'audible',
        recurrs: 0,
        when: 16
    },
    {
        idRef: "619ccb47714cfd0cb3bb4124",
        amount: 50,
        name: 'vodafone Phone',
        recurrs: 0,
        when: 18
    },
    {
        idRef: "619ccb47714cfd0cb3bb4125",
        amount: 54,
        name: 'Vodafone cable',
        recurrs: 0,
        when: 11
    },
    {
        idRef: "619ccb47714cfd0cb3bb4126",
        amount: 20,
        name: 'kinder',
        recurrs: 0,
        when: 10
    },
    {
        idRef: "619ccb47714cfd0cb3bb4127",
        amount: 850,
        name: 'rent',
        recurrs: 0,
        when: 30
    },
    {
        idRef: "619ccb47714cfd0cb3bb4128",
        amount: 68,
        name: 'gas',
        recurrs: 0,
        when: 1
    },
    {
        idRef: "619ccb47714cfd0cb3bb4129",
        amount: 70,
        name: 'strom',
        recurrs: 0,
        when: 1
    },
    {
        idRef: "619ccb47714cfd0cb3bb412a",
        amount: 8,
        name: 'getSafe',
        recurrs: 0,
        when: 2
    },
    {
        idRef: "619ccb47714cfd0cb3bb412b",
        amount: 60,
        name: 'barmenia',
        recurrs: 0,
        when: 2
    },
    {
        idRef: "619ccb47714cfd0cb3bb412c",
        amount: 54.28,
        name: 'paypal waschmachine',
        recurrs: 1,
        when: 26
    },
    {
        idRef: "619ccb47714cfd0cb3bb412d",
        amount: 29.15,
        name: 'paypal tische',
        recurrs: 1,
        when: 26
    },
    {
        idRef: "619ccb47714cfd0cb3bb412e",
        amount: 22.5,
        name: 'paypal guitar',
        recurrs: 0,
        when: 8
    },
    {
        idRef: "619ccb47714cfd0cb3bb412f",
        amount: 60.54,
        name: 'paypal bed',
        recurrs: 0,
        when: 28
    },
    {
        idRef: "619ccb47714cfd0cb3bb4130",
        amount: 20,
        name: 'MCfit',
        recurrs: 0,
        when: 2
    },
    {
        idRef: "619ccb47714cfd0cb3bb4131",
        amount: 9.16,
        name: 'paypal Jareya',
        recurrs: 1,
        when: 20
    },
    {
        idRef: "619ccb47714cfd0cb3bb4132",
        amount: 54.9,
        name: 'grover laptop',
        recurrs: 1,
        when: 22
    },
    {
        idRef: "619ccb47714cfd0cb3bb4133",
        amount: 17.9,
        name: 'grover monitor',
        recurrs: 1,
        when: 22
    },
    {
        idRef: "619ccb47714cfd0cb3bb4134",
        amount: 110,
        name: 'dao one',
        recurrs: 0,
        when: 22
    },
    {
        idRef: "619ccb47714cfd0cb3bb4135",
        amount: 110,
        name: 'dao two',
        recurrs: 0,
        when: 5
    }
]
const Gasdebt = 290
const daoFood = 200
const MoneyAvailablesohneDaoohneGasDebtohneStromGasNew = 1503 //eur
const MoneyAvailableohneDaoohneStromGasNew = 1213
const MoneyAvailableohneStromGasNew = 1013

const countMonths = (beginDate: moment.Moment, endDate: moment.Moment) => {
    var interim = beginDate.clone();
    let nbOfMonths = 0

    while (endDate > interim || interim.format('M') === endDate.format('M')) {

        nbOfMonths++
        interim.add(1, 'month');
    }
   return nbOfMonths
}

export function getReccurenceBill2(beginDate: moment.Moment, endDate: moment.Moment, billDate: number) {

    /**
        * create dates then ask timespan
        * planstart 20.02
        * end 23.03
        * bill on 19 of every month
        * rec:  3
        */
    //how many months?
   const nbOfMonths = countMonths(beginDate,endDate)
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


    // const nbrOfMonths = monthsBtwnDates(beginDate.format(), endDate.format())
    // console.log(nbrOfMonths)
    // if(nbrOfMonths === 0) {return 1}
    // let recurrence = 0
    // const lastMonthDays = endDate.days()
    // if (lastMonthDays > billDate) {
    //     recurrence++
    // }
    // const FirstMonthDays = beginDate.days()
    // if (FirstMonthDays < billDate) {
    //     recurrence++
    // }

    // recurrence = recurrence + ( Math.trunc(nbrOfMonths) -2)

    // return recurrence
}

function calculateSum(billsAnalyzed: AnalyzedBill[]) {

    let sum = 0

    billsAnalyzed.forEach(b => {
        sum = sum + (b.amount * b.recurrs)
    })
    return sum

}

export default {
    updateBill,
    getAllBillsOfOneUser,
}



export function testy() {
    return "a"
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


// Leftovers
    //find user by its id, update its post with what's in req.body
    // UserRepo.Info.findOneAndUpdate(
    //     { username },
    //     {
    //         salary: {
    //             amount: 2601,
    //             dayOfMonth: 16
    //         }
    //     },
    //     { new: true }
    //     ,
    //     (error: any, data: any) => {
    //         if (error) {
    //             console.error(error)
    //         } else {
    //             console.log(data)
    //         }
    //     })



// const postOneBill = (req: Request, res: Response, next: NextFunction) => {
//     //TODO validate user exists 

//     const { sum, text, username, paid, when } = req.body


//     //TODO Get userId based on username 
//     const _billDoc = new BillRepo({
//         id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
//         sum,
//         text,
//         userId: username,  //!!!!! change this to userId
//         paid,
//         when,
//     })

//     return _billDoc.save()
//         .then((bill) => {
//             res.status(201).json({ bill })
//         })
//         .catch((error) => {
//             res.status(500).json({
//                 message: error.message,
//                 error
//             })
//         })
// }

// const getOneBill = () => {

// }

// const getSumBills = (input: Array<Bill>

// ) => {
//     let sum = 0
//     input.forEach(element => {
//         sum = sum + element.
//     });

//     return sum
// }