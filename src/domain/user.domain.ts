
/** try to stay DDD 
 * this is Domain layer 
 */

import {Document} from 'mongoose'

export  default interface IUser extends Document{
    username: string, 
    password: string,
}

export interface IUserInfo extends Document{
    username: string,
    grossBalance: number,
    
}