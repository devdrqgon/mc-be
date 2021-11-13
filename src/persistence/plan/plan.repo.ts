import mongoose, { Schema } from 'mongoose'
import IplanDoc from './plan.docs'


/** try to stay DDD 
 * this is Persistence layer 
 */

const PlanSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        savingGoal: {
            type: Number,
            required: true
        },
        maxSavePerMonth: {
            type: Number,
            required: true
        },
        duration: {
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
export const PlanRepo = mongoose.model<IplanDoc>('Plan', PlanSchema) //Rename faile to UserSChema ??????

