import express from "express";
import cors from 'cors';
import { TimeSpanPlan } from "./models";
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

/**TODO: Log the incoming request */

//Do we need cors? 

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/**TODO:  Rules of api */

/** Routes */
app.use('/users', userRoutes)

/** TODO: Error handling */

/** Create Server */
const httpServer = http.createServer(app)

/** Start server  */
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));


















// function getPlans() {
//     return plans.find()
// }
// app.get('/plans', function (req, res) {
//     res.json(getPlans())
// })
// function planAlreadyExists(userId: string) {
//     if (plans.find({ userId: userId }).length > 0) {
//         return true
//     }
//     return false
// }

// function postPlan(plan: TimeSpanPlan) {
//     plans.insert(plan);
// }
// app.post('/plans', function (req, res) {
//     try {
//         const _plan = req.body.plan
//         //makesure this is a valid pla
//         //if no
//         // send a msg indicating what s wrong
//         if (planAlreadyExists(_plan.userId)) {
//             console.log("User already has a plan")
//             throw Error("I love chocotom");
//         } else {
//             //else: 
//             // assign a unique id to the plan 
//             // persist it 
//             // send a msg saying alles gut 
//             postPlan(_plan)
//         }
//         console.log(`plan of user "${_plan.userId}" was created`)
//         res.send(req.body.plan);
//     } catch (error: any) {
//         res.status(409).send({
//             "title": error.message
//         });
//     }
// })
