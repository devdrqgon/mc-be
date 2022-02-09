
import axios from 'axios'
import { v4 as uuidv4, v4 } from 'uuid'

let jwt = 'Bearer  '
let RequisitionId
let userBankSignInLink = 'undef'

//1

const selectJWT = () => jwt
const selectLink = () => userBankSignInLink

const requestJWT = async () => {
    try {
        let res = await axios({
            method: 'POST',
            url: 'https://ob.nordigen.com/api/v2/token/new/',
            headers: {
                ContentType: 'application/x-www-form-urlencoded'
            },
            data: {
                secret_id: "0f1800f4-d8cc-4437-ba37-47e616614296",
                secret_key: "71055029e59a706f83faa0cddaea608a224728cc832f3cd9a3737d8eda2d5684bd3381363b9a183ac15257ac85077f404bd52f2c1de515027f584ae8b95d90a1"
            },
        })
        //    console.log(res)
        jwt = jwt + res.data.access
        //    console.log(jwt)
    }
    catch (e) {
        console.error(e)
    }

}

// get link for user to sign in, and save RequisitionId 
const createRequisition = async (bankId: string) => {
    try {
        let res = await axios({
            method: 'POST',
            url: 'https://ob.nordigen.com/api/v2/requisitions/',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ0NDk1ODczLCJqdGkiOiIyYjZlNjczOTgyNzM0ZmY5OTE2YTdmMzg3ZjljOTE0MyIsImlkIjo0ODc2LCJzZWNyZXRfaWQiOiIwZjE4MDBmNC1kOGNjLTQ0MzctYmEzNy00N2U2MTY2MTQyOTYiLCJhbGxvd2VkX2NpZHJzIjpbIjAuMC4wLjAvMCIsIjo6LzAiXX0.xn0E83FUtSL9_NMWD1Suc9Ornu4bkCTb1RQHnILLh20'
            },
            data: {
                redirect: "https://www.google.com/",
                institution_id: "KSK_HEILBRONN_HEISDE66XXX",
                reference: uuidv4(),  //MUST BE UNIQUE
                user_language: "EN"
            },
        })

        RequisitionId = res.data.id
        userBankSignInLink = res.data.link
    }
    catch (e) {
        console.error(e)
    }
}
const nordigen = {
    RequisitionId,
    userBankSignInLink,
    jwt,
    requestJWT,
    selectJWT,
    selectLink,
    createRequisition

}

export default nordigen