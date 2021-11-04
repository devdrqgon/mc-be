import express from 'express'
import userController from '../controllers/user.controller'

const router = express.Router()

router.get('/validate',userController.validateToken)
router.post('/register',userController.registerUser)
router.post('/login',userController.logInUser)
router.get('/get/all',userController.getAllUsers) 

export = router