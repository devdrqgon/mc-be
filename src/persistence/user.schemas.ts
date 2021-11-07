import mongoose, { Schema } from 'mongoose'
import IUser from '../domain/user.domain'


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
            required: true
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



const UserAccountRepo = mongoose.model<IUser>('UserAccount',userAccountSchema) //Rename faile to UserSChema ??????
const userInfoRepo = mongoose.model<IUser>('userInfoSchema',userInfoSchema) //Rename faile to UserSChema ??????


export default{
    UserAccountRepo,
    userInfoRepo
}