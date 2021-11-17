import mongoose, { Schema } from 'mongoose'
import IUserDoc, { IUserInfoDoc } from './user.docs'

//Types in mongoose are hard !
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
//Dont force a design , e,g when u naned this file user.reop
const userInfoSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        salary: {
            type: Number,
            required: true
        },
        dayOfMonthOfSalary: {
            type: Number,
            required: true
        },
        bills: {
            type: Map,
            of: new Schema(
                {
                    billName: {
                        type: String,
                        required: true
                    },
                    username: {
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
                }
            )
        },
        accounts: {
            type: Map,
            of: new Schema(
                {
                    accountType: {
                        type: String,
                        required: true
                    },
                    balance: {
                        type: String,
                        required: true
                    },
                    active: {
                        type: Boolean,
                        required: true
                    },

                }
            )
        },
        weeklybudget: {
           type:{
                sum: {
                    type: Number,
                    required: true
                },
                spent: {
                    type: Number,
                    required: true
                }
           },
           required: false,
        }
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
const Info = mongoose.model('userInfoSchema', userInfoSchema) //Rename faile to UserSChema ??????


export const UserRepo = {
    Account,
    Info
}