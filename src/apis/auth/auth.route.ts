import express from 'express'
import authAPI from './auth.api'
import validateJWT from './jwt.validations'

const router = express.Router()




//auth  or account
router.get('/validate',validateJWT, authAPI.validateToken)
router.post('/register',authAPI.registerUser)
router.post('/login',authAPI.logInUser)
router.get('/get/all', validateJWT, authAPI.getAllUsers) 

export = router