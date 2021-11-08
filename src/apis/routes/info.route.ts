import express from 'express'
import UserInfoAPI from '../../apis/info.api'
import validateJWT from '../middlewares/validateJWT.middleware'

const router = express.Router()

router.get('/get/all', UserInfoAPI.getAllUserInfos) // / or empty string
router.get('/id', validateJWT, UserInfoAPI.getOneUserInfo)
router.post('/', UserInfoAPI.createOneUserInfo)
router.put('/', validateJWT, UserInfoAPI.UpdateOneUserInfo)

export = router