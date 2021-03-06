import express from 'express'
import UserInfoAPI from './info.api'
import validateJWT from '../auth/jwt.validations'

const router = express.Router()

// router.get('/get/all',validateJWT, UserInfoAPI.getAllUserInfos) // / or empty string
router.get('/:username', validateJWT, UserInfoAPI.getOneUserInfo)

export = router