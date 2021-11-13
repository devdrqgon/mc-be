import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose'
import logging from "../../infrastructure/logging";
import { PlanRepo } from "../../persistence/plan/plan.repo";

const namespace = "planAPI"
const postOnePlan = (req: Request, res: Response, next: NextFunction) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to post plan.")

    const { username, savingGoal, maxSavePerMonth, duration } = req.body


    //TODO Get userId based on username 
    const _planDoc = new PlanRepo({
        id: new mongoose.Types.ObjectId(), // maaaybe small maybe exclude mongoose from this file and move it to the 
        username,
        savingGoal,
        maxSavePerMonth,
        duration,
    })

    return _planDoc.save()
        .then((plan) => {
            res.status(201).json({ plan })
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error
            })
        })
}

const getOnePlan = (req: Request, res: Response, next: NextFunction) => {
    logging.info(`CONTROLLER:${namespace}`, "attempting to get plan.")

    const username = req.params.username as string
    PlanRepo.find({ username })
        .exec()
        .then((plans) => {
            return res.status(200).json({ plan: plans })
        })
        .catch((err) => {
            logging.error("[planAPI]", err.message, err)

            return res.status(409).json({ message: 'planAPI err' })
        })
}



const putOneBill = () => {

}
const removeOneBill = () => {

}
export default {
    postOnePlan,
    getOnePlan,
    putOneBill,
    removeOneBill
}
