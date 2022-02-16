import express from "express"
import validateJWT from "../auth/jwt.validations"
import billAPI from './bill.api'

const router = express.Router()


router.get('/get/all/:username',validateJWT, billAPI.getAllBillsOfOneUser)
// router.get('/get/all/:username/:beginDate/:endDate',validateJWT, billAPI.getAllBillsOfOneUserInADuration)
router.put('/:id',validateJWT, billAPI.updateBill)


export = router