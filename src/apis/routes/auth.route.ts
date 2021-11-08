import express from 'express'
import AccountController from '../auth.api'
import validateJWT from '../middlewares/validateJWT.middleware'

const router = express.Router()




//auth  or account
router.get('/validate',validateJWT, AccountController.validateToken)
router.post('/register',AccountController.registerUser)
router.post('/login',AccountController.logInUser)
router.get('/get/all', validateJWT, AccountController.getAllUsers) 

export = router