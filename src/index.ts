
/**
 * Currenlty, what we have is a server that generates time-limited tokens, and only those requests containing
 * the token are allowed to certain endpoints. 
 * 
 * No Support for Refresh Tokens, TODO: Research and maybe Implementation 
 */


import express from "express";
import userRoutes from "./routes/user.routes";
import http from 'http';
import config from "./config/config";
import logging from "./config/logging";
import mongoose from 'mongoose'

const NAMESPACE = 'Server'

/** Connect to db  */
mongoose.connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logging.info(NAMESPACE, "MongoDB Connected!")
    })
    .catch(error => {
        logging.error(NAMESPACE, "Could not connect to MongoDB!", error)
    })

const app = express()

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


/**TODO: Log the incoming request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

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


/**TODO:  Rules of api */

/** Routes */
app.use('/users', userRoutes)

/** TODO: Error handling */

/** Create Server */
const httpServer = http.createServer(app)

/** Start server  */
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));














