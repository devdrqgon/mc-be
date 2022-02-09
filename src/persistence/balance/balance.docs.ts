
/** try to stay DDD 
 * this is Domain layer 
 */

 import {Document} from 'mongoose'
import { userPersonalInfos } from '../../domain/user.domain';

 export  default interface IBalanceDoc extends Document{
     amount: string, 
     username: string
 }
 