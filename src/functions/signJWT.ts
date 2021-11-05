import jwt from 'jsonwebtoken'
import config from '../config/config'
import logging from '../config/logging'
import IUser from '../interfaces/user.interface'

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
                    callback(error,null)
                }
                else if(token) {
                    callback(null,token)
                }
            }
        )
    } catch (err) { 
        logging.error(NAMESPACE,(<Error> err).message, err) //! Do typing better 
        callback((<Error> err),null)
    }
}

export default signJWT