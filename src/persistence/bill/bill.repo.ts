import mongoose, { Schema } from 'mongoose'
import IBillDoc from './bill.docs'


/** try to stay DDD 
 * this is Persistence layer 
 */

const BillSchema = new Schema(
    {
        sum: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        paid: {
            type: Boolean,
            required: true
        },
        when: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)



/** Did not name Userrepo, although it is a repo
 * because the important object would give access 
 * to all repos. and it is named with the suffix 'Repo' e.g 'UserRepo.Acounts'
 */

// TODO: rename to plural
export const BillRepo = mongoose.model<IBillDoc>('Bill', BillSchema) //Rename faile to UserSChema ??????

