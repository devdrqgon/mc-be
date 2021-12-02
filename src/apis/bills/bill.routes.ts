import express from "express"
import validateJWT from "../auth/jwt.validations"
import billAPI from './bill.api'

const router = express.Router()


router.get('/get/all/:username',validateJWT, billAPI.getAllBillsOfOneUser)
router.put('/:id',validateJWT, billAPI.updateBill)


export = router