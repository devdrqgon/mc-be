import mongoose, { Schema } from 'mongoose'
import IUserDoc, { IUserInfoDoc } from './user.docs'


/** try to stay DDD 
 * this is Persistence layer 
 */

const userAccountSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)


const userInfoSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        grossBalance: {
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
const Account = mongoose.model<IUserDoc>('UserAccount', userAccountSchema) //Rename faile to UserSChema ??????
const Info = mongoose.model<IUserInfoDoc>('userInfoSchema', userInfoSchema) //Rename faile to UserSChema ??????


export const UserRepo = {
    Account,
    Info
}