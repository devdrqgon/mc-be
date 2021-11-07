import express from 'express'
import AccountController from '../../controllers/userAccount.controller'
import extractJWT from '../../middlewares/extractJWT'

const router = express.Router()




//auth  or account
router.get('/validate',extractJWT, AccountController.validateToken)
router.post('/register',AccountController.registerUser)
router.post('/login',AccountController.logInUser)
router.get('/get/all', extractJWT, AccountController.getAllUsers) 

export = router