import express from "express"
import validateJWT from "../auth/jwt.validations"
import { updateBill } from "./bill.api"
 
const router = express.Router()


// router.get('/get/all/:username',validateJWT,  getAllBillsOfOneUser)
// router.get('/get/all/:username/:beginDate/:endDate',validateJWT, billAPI.getAllBillsOfOneUserInADuration)
router.put('/:id',validateJWT, updateBill)


export = router