import { Request, Response, NextFunction } from 'express'

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