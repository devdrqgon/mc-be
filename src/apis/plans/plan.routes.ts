import express from 'express'
import validateJWT from '../auth/jwt.validations'
import planAPI from './plan.api'

const router = express.Router()

router.get('/get/:username', validateJWT, planAPI.getOnePlan)
router.post('/', validateJWT, planAPI.postOnePlan)
router.put('/:username', validateJWT, planAPI.putOneBill)

export = router