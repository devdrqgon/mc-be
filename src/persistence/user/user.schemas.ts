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
export interface PeriodOfTime {
    start: number,
    end: number
}
export interface NewBill {
    username: string,
    paid: boolean,
    friendlyName: string,
    bankText: string,
    amount: number,
    when: PeriodOfTime,
    billType: string
}
export interface NewAccount {
    accountType: string,
    balance: number
}
export interface NewSalary {
    amount: number,
    when: PeriodOfTime
}
export interface NewUserInfoSchema {
    username: string,
    salary: {
        amount: number,
        dayOfMonth: PeriodOfTime
    },
    bills: Array<NewBill>,
    accounts: Array<NewAccount>
}
//Dont force a design , e,g when u naned this file user.reop
const newUserInfoSchema = new Schema<NewUserInfoSchema>(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        salary: new Schema<NewSalary>(
            {
                amount: {
                    type: Number,
                    required: true
                },
                when: new Schema<PeriodOfTime>(
                    {
                        start: {
                            type: Number,
                            required: true
                        },
                        end: {
                            type: Number,
                            required: true
                        }
                    },
                    {
                        _id: false,
                        timestamps: false
                    }
                )
            },
            {
                _id: false,
                timestamps: false
            }
        ),
        bills: [
            new Schema<NewBill>(
                {
                    friendlyName: {
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
                    bankText: {
                        type: String,
                        required: true
                    },
                    billType: {
                        type: String,
                        required: true
                    },
                    when: new Schema(
                        {
                            start: {
                                type: Number,
                                required: true
                            },
                            end: {
                                type: Number,
                                required: true
                            }
                        },
                        {
                            _id: false,
                            timestamps: false
                        }
                    ),
                    amount: {
                        type: Number,
                        required: true
                    }
                },
                {
                    _id: true,
                    timestamps: false
                }
            )],
        accounts: [
            new Schema<NewAccount>(
                {
                    accountType: {
                        type: String,
                        required: true
                    },
                    balance: {
                        type: Number,
                        required: true
                    }

                },
                {
                    _id: true,
                    timestamps: false
                }
            )]
    },
    {
        timestamps: false,
        versionKey: false
    }

)
const userInfoWithSalarySchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        salary: new Schema(
            {
                amount: {
                    type: Number,
                    required: true
                },
                dayOfMonth: {
                    type: Number,
                    required: true
                }
            },
            {
                _id: false,
                timestamps: false
            }
        ),
        bills: [new Schema(
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
                cost: {
                    type: Number,
                    required: true
                },
                when: {
                    type: Number,
                    required: true
                }
            },
            {
                _id: true,
                timestamps: false
            }
        )],
        accounts: [new Schema(
            {
                accountType: {
                    type: String,
                    required: true
                },
                balance: {
                    type: Number,
                    required: true
                },
                active: {
                    type: Boolean,
                    required: true
                },

            },
            {
                _id: true,
                timestamps: false
            }
        )],
        weeklyBudget: new Schema(
            {
                limit: {
                    type: Number,
                    required: true
                },
                spent: {
                    type: Number,
                    required: true
                }
            },
            {
                _id: false,
                timestamps: false
            }
        ),
        savingGoal: {
            type: Number
        },
    },
    {
        timestamps: false,
        versionKey: false
    }

)


/** Did not name Userrepo, although it is a repo
 * because the important object would give access 
 * to all repos. and it is named with the suffix 'Repo' e.g 'UserRepo.Acounts'
 */

// TODO: rename to plural
const Account = mongoose.model<IUserDoc>('userAccountSchema', userAccountSchema) //Rename faile to UserSChema ??????
const Info = mongoose.model('userInfoSchema', userInfoWithSalarySchema) //Rename faile to UserSChema ??????
const NewInfo = mongoose.model<NewUserInfoSchema>('newUserInfoSchema', newUserInfoSchema)


export const UserRepo = {
    Account,
    Info,
    NewInfo
}