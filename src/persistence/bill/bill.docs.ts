
/** try to stay DDD 
 * this is Domain layer 
 */

import { Document } from 'mongoose'

export default interface IBillDoc extends Document {
    id: string,
    sum: number,
    text: number,
    userId: string,
    paid: boolean,
    when: number,
}
