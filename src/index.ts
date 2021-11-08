
/**
 * Currenlty, what we have is a server that generates time-limited tokens, and only those requests containing
 * the token are allowed to certain endpoints. 
 * 
 * No Support for Refresh Tokens, TODO: Research and maybe Implementation 
 */


import express from "express";
import userAuthRoutes from "./apis/routes/auth.route"
import userInfoRoutes from "./apis/routes/info.route";
import http from 'http';
import config from "./infrastructure/config";
import logging from "infrastructure/logging";
import mongoose from 'mongoose'
import cors from "cors";

const NAMESPACE = 'Server'

/** Connect to db  */
config.connectDB()

const app = express()

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


/**TODO: Log the incoming request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.originalUrl}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
})

/** Do we need cors middleware? 
 * Not sure, 
 * but currently, it is not used and the backend is responding to localhost react
 */
// app.use(cors)

/**TODO:  Rules of api */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});
/** Routes */
app.use('/users/auth', userAuthRoutes)
app.use('/users/info', userInfoRoutes)

/** TODO: Error handling */

/** Create Server */
const httpServer = http.createServer(app)

/** Start server  */
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));














