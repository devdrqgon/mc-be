
/** try to stay DDD 
 * this is Domain layer 
 */

import { Document } from 'mongoose'

export default interface IplanDoc extends Document {
    usename: string
    savingGoal: number
    maxSavePerMonth: number,
    duration: number,
}
