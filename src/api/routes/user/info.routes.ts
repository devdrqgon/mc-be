import express from 'express'
import UserInfoController from '../../controllers/userInfo.controller'
import extractJWT from '../../middlewares/extractJWT'

const router = express.Router()

router.get('/get/all', UserInfoController.getAllUserInfos) // / or empty string
router.get('/id', extractJWT, UserInfoController.getOneUserInfo)
router.post('/', UserInfoController.createOneUserInfo)
router.put('/', extractJWT, UserInfoController.UpdateOneUserInfo)

export = router