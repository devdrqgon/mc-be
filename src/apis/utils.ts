import jwt from 'jsonwebtoken'
import config, { namespaces } from '../infrastructure/config'
import logging from '../infrastructure/logging'
import IUser from '../domain/user.domain'
import { Request, Response, NextFunction } from 'express'
import { UserRepo } from '../persistence/user/user.schemas'

const NAMESPACE = 'Auth'

const signJWT = (
    user: IUser,
    callback: (error: Error | null, token: string | null) => void
) => {
    logging.info(NAMESPACE, `Attempting to sign token for ${user.username}`)

    /** Singing token */
    try {
        jwt.sign(
            {
                username: user.username
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: '3 days'
            },
            (error, token) => {
                if (error) {
                    callback(error, null)
                }
                else if (token) {
                    callback(null, token)
                }
            }
        )
    } catch (err) {
        logging.error(NAMESPACE, (<Error>err).message, err) //! Do typing better 
        callback((<Error>err), null)
    }
}


//refactor this
const checkIfUsernameIsFoundUnique = (username: string) => {
    UserRepo.Info.find({ username })
        .exec()
        .then((res) => {
            switch (res.length) {
                case 0:
                    logging.error(namespaces.api, "[FATAL] no USERNAME found in DB")
                    return "username not found"
                case 1:
                    return "username ok"
                default:
                    logging.error(namespaces.api, "[FATAL] Multiple USERNAME found in DB")
                    return "username duplicate in db"

            }
        })
        .catch((err) => {
            logging.error("[userInfoAPI]", err.message, err)
            return err.message as string
        })
}

export const utils = {
    signJWT,
    checkIfUsernameIsUnique: checkIfUsernameIsFoundUnique
}