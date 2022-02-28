import mongoose, { Schema } from 'mongoose'
import { BillDoc } from './bills.docs'




const billSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        friendlyName: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        when: new Schema(
            {
                start: {
                    type: String,
                    required: true
                },
                end: {
                    type: String,
                    required: true
                }
            },
            {
                _id: false,
                timestamps: false
            }
        ),
        paid: {
            type: String,
            required: true
        },
        billType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
const Bill = mongoose.model<BillDoc>('creditorName', billSchema)

export const BillsRepo = {
    Bill
}