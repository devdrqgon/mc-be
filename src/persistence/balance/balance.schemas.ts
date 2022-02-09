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




/** Did not name Userrepo, although it is a repo
 * because the important object would give access 
 * to all repos. and it is named with the suffix 'Repo' e.g 'UserRepo.Acounts'
 */

// TODO: rename to plural
const Balance = mongoose.model<IBalanceDoc>('balanceSchema', balanceSchema) //Rename faile to UserSChema ??????


export const BalanceRepo = {
    Balance
}