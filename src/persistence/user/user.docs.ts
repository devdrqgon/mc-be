
/** try to stay DDD 
 * this is Domain layer 
 */

 import {Document} from 'mongoose'

 export  default interface IUserDoc extends Document{
     username: string, 
     password: string,
 }
 
 export interface IUserInfoDoc extends Document{
     username: string,
     grossBalance: number,
     
 }