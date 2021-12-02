import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import { userInfo } from "os";
import { Bill } from "../../domain/user.domain";
import logging from "../../infrastructure/logging";
import { IUserInfoDoc } from "../../persistence/user/user.docs";
import { UserRepo } from "../../persistence/user/user.schemas";


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

export default {
    updateBill,
    getAllBillsOfOneUser,
}
