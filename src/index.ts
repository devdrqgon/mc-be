
/**
 * Currenlty, what we have is a server that generates time-limited tokens, and only those requests containing
 * the token are allowed to certain endpoints. 
 * 
 * No Support for Refresh Tokens, TODO: Research and maybe Implementation 
 */


import express from "express";
import userAuthRoutes from "./apis/auth/auth.route"
import userInfoRoutes from "./apis/userInfos/info.route";
import billRoutes from "./apis/bills/bill.routes";
import http from 'http';
import config from "./infrastructure/config";
import logging from "./infrastructure/logging";
import nordigen from "./infrastructure/nordigenAdapter";


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

/**tbd:  Rules of api */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next()
})

/** Routes */
app.use('/users/auth', userAuthRoutes)
app.use('/users/info', userInfoRoutes)
app.use('/bills', billRoutes)


/** TODO: Error handling */

/** Test Nordigen  */
const NordigenTester = async () =>{
    await nordigen.requestJWT()
    await nordigen.createRequisition('KSK_HEILBRONN_HEISDE66XXX')
    console.log("LINK", nordigen.selectLink())
} 
NordigenTester()

/** Create Server */
const httpServer = http.createServer(app)

/** Start server  */
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));














