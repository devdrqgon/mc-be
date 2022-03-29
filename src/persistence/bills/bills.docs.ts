
/** try to stay DDD 
 * this is Domain layer 
 */

import { Document } from 'mongoose'

export  interface BillDoc extends Document {

    friendlyName: string,
    text: string,
    when: {
        start: string,
        end: string
    },
    amount: string,
    paid: string,
    billType: string
}

 