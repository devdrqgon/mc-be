
/** try to stay DDD 
 * this is Domain layer 
 */

 import {Document} from 'mongoose'
import { userPersonalInfos } from '../../domain/user.domain';

 export  default interface IUserDoc extends Document{
     username: string, 
     password: string,
 }
 
 export interface IUserInfoDoc extends Document{
    infosOfUser: userPersonalInfos
     
 }