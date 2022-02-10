
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

let jwt = 'Bearer  '
let MyAccountID66 = '609c3976-df41-4253-ae1a-6be551db8959' //NOw hard coded, will be dynamic in prod 
let userBankSignInLink = 'undef'

//1

const selectJWT = () => jwt
const selectLink = () => userBankSignInLink
const selectMyAccountID66 = () => MyAccountID66
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
        jwt = res.data.access
        return res.data.access
        //    console.log(jwt)
    }
    catch (e) {
        console.error(e)
    }

}

// get link for user to sign in, and save RequisitionId 
const createRequisition = async (bankId: string) => {
    try {
        // console.log("JWWWWWT", jwt)
        let res = await axios({
            method: 'POST',
            url: 'https://ob.nordigen.com/api/v2/requisitions/',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            data: {
                redirect: "https://www.google.com/",
                institution_id: "KSK_HEILBRONN_HEISDE66XXX",
                reference: uuidv4(),  //MUST BE UNIQUE
                user_language: "EN"
            },
        })

        MyAccountID66 = res.data.id
        userBankSignInLink = res.data.link
    }
    catch (e) {
        console.error(e)
    }
}



const requestBalance = async (_jwt: string) => {
    try {
        let bearerJwt = `Bearer ${_jwt}`
        console.log(`Bearer ${_jwt}`)
        let res = await axios({
            method: 'GET',
            url: `https://ob.nordigen.com/api/v2/accounts/609c3976-df41-4253-ae1a-6be551db8959/balances/ `,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': bearerJwt
            }
        })
        console.log("good job bouhmid, your balance is:" + res.data.balances[0].balanceAmount.amount)

        return res.data.balances[0].balanceAmount.amount
    }
    catch (e) {
        console.error(e)
    }
}


const nordigen = {
    RequisitionId: MyAccountID66,
    userBankSignInLink,
    jwt,
    requestJWT,
    selectJWT,
    selectLink,
    createRequisition,
    requestBalance

}

export default nordigen



// 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ0NDk1ODczLCJqdGkiOiIyYjZlNjczOTgyNzM0ZmY5OTE2YTdmMzg3ZjljOTE0MyIsImlkIjo0ODc2LCJzZWNyZXRfaWQiOiIwZjE4MDBmNC1kOGNjLTQ0MzctYmEzNy00N2U2MTY2MTQyOTYiLCJhbGxvd2VkX2NpZHJzIjpbIjAuMC4wLjAvMCIsIjo6LzAiXX0.xn0E83FUtSL9_NMWD1Suc9Ornu4bkCTb1RQHnILLh20'