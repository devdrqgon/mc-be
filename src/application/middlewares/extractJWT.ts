import { Request, Response, NextFunction } from 'express'
import logging from '../config/logging'
import jwt from 'jsonwebtoken'
import config from '../config/config'

const NAMESPACE = "Auth"

/**
 * Asynchronously verify given token using a secret or a public key to get a decoded token token
 * @param req 
 * @param res 
 * @param next 
 * @returns  decoded token or 401/404 response 
 */
const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating Token...")

    //Etracting token
    let token = (<string>req.headers.authorization)?.split(' ')[1]

    if (token) {
        /** Verifying Token */
        jwt.verify(
            token,
            config.server.token.secret,
            (error, decoded) => {
                if (error) {
                    logging.error(NAMESPACE, error.message)
                    return res.status(401).json({ // we can also send 404 to give the 'potential attakcer less hints'
                        message: error.message,
                        error
                    })
                }
                else {
                    res.locals.jwt = decoded /** pass along decoded jwt   */
                    next()
                }
            }
        )
    }
    else {
        /** No Token found */

        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

export default extractJWT