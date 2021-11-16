import { Request, Response, NextFunction } from 'express'
import { namespaces } from '../../infrastructure/config'
import logging from '../../infrastructure/logging'
import { UserRepo } from '../../persistence/user/user.schemas'
import { utils } from '../utils'

const post = (req: Request, res: Response, next: NextFunction) => {}

const getAll = () => { }
const getOne = () => { }
const putOne = () => { }

export const userInfoValidators = {
    post,
    getAll,
    getOne,
    putOne
}