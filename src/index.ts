
/**
 * Currenlty, what we have is a server that generates time-limited tokens, and only those requests containing
 * the token are allowed to certain endpoints. 
 * 
 * No Support for Refresh Tokens, TODO: Research and maybe Implementation 
 */

import fs from 'fs'
import jsonDatafrom from '../transactions.json'
import express from "express";
import userAuthRoutes from "./apis/auth/auth.route"
import userInfoRoutes from "./apis/userInfos/info.route";
import billRoutes from "./apis/bills/bill.routes";
import http from 'http';
import config from "./infrastructure/config";
import logging from "./infrastructure/logging";
import { flowSim, getTransactionsFromBankTester, getLastUpdateTime, retrieveBalanceDTO, retrieveInfoDTO, updateBalanceDocument, updateBalanceInUserInfoDocument, getBalanceFromBankTester, updateBills, removeSpacesFromString } from "./apis/userInfos/info.api";
import moment from "moment";
import nordigen, { getTransactions, TransactionConverted } from "./infrastructure/nordigenAdapter";
import { Mongoose } from "mongoose";
import { sumOfEverything } from './apis/bills/data';
import { initUserInfoDoc } from './apis/userInfos/tempInfo';
// import nordigen from "./infrastructure/nordigenAdapter";


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
const NordigenTester = async () => {
    // await nordigen.requestJWT()
    // await nordigen.createRequisition('KSK_HEILBRONN_HEISDE66XXX')
    // const balance = await nordigen.requestBalance()
    // console.log("good job bouhmid, your balance is:"+ balance)
    // console.log("LINK", nordigen.selectLink())
    // await retrieveBalanceDoc('amddev')
    // await updateBalanceDocument()
    // console.log("S")
    // const last = await getLastUpdateTime('amddev')
    // console.log(last)
    // const res = await updateBalanceInUserInfoDocument("1", 'amddev')
    // console.log("UPDATED USERINFO DOC ::", res)
    // await flowSim()
    //await flowSim()
    const now = moment({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
    })

    const start2 = moment({
        year: 2022,
        month: 1,
        day: 1
    })
    const end = moment({
        year: 2022,
        month: 2,
        day: 30
    })
    //GetSumBillsInADuration('amddev',start,end)
    // retrieveInfoDTO('amddev')
    // //const dto = await retrieveInfoDTO('amddev')
    // const dto = await getBalanceFromBankTester()
    // console.info("getBalanceFromBankTester o",dto)
    // await getBalanceFromBank()

    //    let access_token = await nordigen.requestJWT()
    //     const t = await getTransactions(access_token, start2)
    //     let jsonContent = JSON.stringify(t);

    //     fs.writeFile("transactions.json", jsonContent, 'utf8', function (err) {
    //         if (err) {
    //             console.log("An error occured while writing JSON Object to File.");
    //             return console.log(err);
    //         }

    //         console.log("JSON file has been saved.");
    //     });

    // let t :Jso[] = []
    // jsonDatafrom.forEach(element => {
    //     t.push(element)
    // })
    // console.info(" sumOfEverything() o",  sumOfEverything())

    //  analyzecreditorNameNoPrice(start2,end,t)
    // await initUserInfoDoc()
    await updateBills('amddev')
    // console.log("Finale",removeSpacesFromString("Vodafone Deutschland GmbH                                             Beta-Str. 6-8"))
}
NordigenTester()
const recurrenceTester = () => {
    const start = moment({
        year: 2022,
        month: 2,
        day: 30
    })
    const end = moment({
        year: 2022,
        month: 5,
        day: 30
    })
    const billDate = 22 //Make sure getReccurenceBill gets billdate as number not string
    // const rec  = getReccurenceBill(start, end, billDate)

    // console.info("RECURRENCE ::", rec)
}

// recurrenceTester()
// recurrenceTester()
/** Create Server */
//const httpServer = http.createServer(app)

/** Start server  */
//httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));














function getSum(arg0: string) {
    throw new Error("Function not implemented.");
}

/**
 * 
 * 
 * {
      additionalInformation: 'FOLGELASTSCHRIFT',
      bookingDate: '2022-02-01',
      creditorAccount: [Object],
      creditorAgent: 'DEUTDEFF',
      creditorName: 'PayPal (Europe) S.a.r.l. et Cie., S.C.A.',
      debtorAgent: 'HEISDE66',
      endToEndId: '1018196478281 PP.7317.PP PAYPAL',
      entryReference: '2022-02-01-04.25.46.774454',
      mandateId: '4AG2224SC2RGY',
      proprietaryBankTransactionCode: 'NDDT+105+9250+992-DK',
      remittanceInformationStructured: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
      transactionAmount: [Object],
      transactionId: '516b94d9d83c2b4e6a06f31ce87afca0',
      valueDate: '2022-02-01'
    },


    {
      additionalInformation: 'FOLGELASTSCHRIFT',
      bookingDate: '2022-02-01',
      creditorAccount: [Object],
      creditorAgent: 'DEUTDEFF',
      creditorName: 'PayPal (Europe) S.a.r.l. et Cie., S.C.A.',
      debtorAgent: 'HEISDE66',
      endToEndId: '1018196479072 PP.7317.PP PAYPAL',
      entryReference: '2022-02-01-04.22.34.265170',
      mandateId: '4AG2224SC2RGY',
      proprietaryBankTransactionCode: 'NDDT+105+9250+992-DK',
      remittanceInformationStructured: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
      transactionAmount: [Object],
      transactionId: '67fa5f65b183d94e8cec3ef562e457e7',
      valueDate: '2022-02-01'
    },
 */