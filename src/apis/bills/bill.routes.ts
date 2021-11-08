import express from "express"
import validateJWT from "../auth/jwt.validations"
import billAPI from './bill.api'

const router = express.Router()


router.get('/:id',validateJWT, billAPI.getOneBill)
router.get('/get/all/:username',validateJWT, billAPI.getAllBillsOfOneUser)
router.post('/',validateJWT, billAPI.postOneBill)
router.put('/:id',validateJWT, billAPI.putOneBill)
router.delete('/:id',validateJWT, billAPI.removeOneBill)

export = router