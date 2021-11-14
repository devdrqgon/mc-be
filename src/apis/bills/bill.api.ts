import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import IBillDoc from "../../persistence/bill/bill.docs";
import { BillRepo } from "../../persistence/bill/bill.repo";

const postOneBill = (req: Request, res: Response, next: NextFunction) => {
    //TODO validate user exists 

    const { sum, text, username, paid, when } = req.body


    //TODO Get userId based on username 
    const _billDoc = new BillRepo({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        sum,
        text,
        userId: username,  //!!!!! change this to userId
        paid,
        when,
    })

    return _billDoc.save()
        .then((bill) => {
            res.status(201).json({ bill })
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error
            })
        })
}

const getOneBill = () => {

}

const getSumBills = (input: Array<IBillDoc & {
    _id: any;
}>

) => {
    let sum = 0 
    input.forEach(element => {
        sum = sum + element.sum
    });

    return sum
}
const getAllBillsOfOneUser = (req: Request, res: Response) => {
    const username = req.params.username as string
    BillRepo.find({ userId: username })
        .exec()
        .then((bill) => {
            
            return res.status(200).json({ bills: bill, sum: getSumBills(bill) })
        })
        .catch((err) => {

            return res.status(409).json({ message: 'no bills found' })
        })
}

const putOneBill = () => {

}
const removeOneBill = () => {

}
export default {
    postOneBill,
    getOneBill,
    getAllBillsOfOneUser,
    putOneBill,
    removeOneBill
}
