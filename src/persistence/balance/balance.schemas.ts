import mongoose, { Schema } from 'mongoose'
import IBalanceDoc from './balance.docs'

//Types in mongoose are hard !
/** try to stay DDD 
 * this is Persistence layer 
 */

const balanceSchema = new Schema(
    {
        amount: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)



 
 const Balance = mongoose.model<IBalanceDoc>('balances', balanceSchema) //Rename faile to UserSChema ??????


export const BalanceRepo = {
    Balance
}