import express from 'express'
import userController from '../userAccount.controller'
import extractJWT from '../middlewares/extractJWT'

const router = express.Router()

router.get('/validate',extractJWT, userController.validateToken)
router.post('/register',userController.registerUser)
router.post('/login',userController.logInUser)
router.get('/get/all', extractJWT, userController.getAllUsers) 

export = router