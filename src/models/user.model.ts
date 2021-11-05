import { timeStamp } from 'console'
import mongoose, { Schema } from 'mongoose'
import IUser from '../interfaces/user.interface'

const userSchema = new Schema(
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

export default mongoose.model<IUser>('User',userSchema) //Rename faile to UserSChema ??????