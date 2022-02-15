const axios = require('axios')
let jwt = 'Bearer'
let RequisitionId
let userBankSignInLink
//1
const getAccessToken = async () => {
    try{
        res = await   axios({
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
       
       jwt = 'Bearer  ' + res.data.access
    }
    catch(e){
        console.error(e)
    }

}


const setJWTGlobalVariable = async() =>{
    await getAccessToken()
    // console.log(jwt)
}



// get link for user to sign in, and save RequisitionId 
const createRequisition = async (bankId) =>{
    try{
        res = await   axios({
            method: 'POST',
            url: 'https://ob.nordigen.com/api/v2/requisitions/',
            headers: {
                ContentType: 'application/json',
                Authorization: jwt },
            data: {
                redirect: "https://www.google.com/", 
                institution_id: "KSK_HEILBRONN_HEISDE66XXX",
                reference: "13",  //MUST BE UNIQUE
                user_language:"EN"  
            },
        })
       
       RequisitionId = res.data.id
       userBankSignInLink = res.data.link
    }
    catch(e){
        console.error(e)
    }
}

const getJWTandRequistionData = async () =>{

    await  getAccessToken()
    console.log("<JWT>", jwt)

    await createRequisition()
   console.log("LINK", userBankSignInLink)


}

getJWTandRequistionData()

//Only used after user balance exists in db, checks if the last written Balance is older than xHours, if yes calls the bank again  
const CheckUserBalance = (xHours) => {

    // get user balance from db 
    
    // check Now - LastupadteFromBank is older than X hours 
       /**
        * True:  Reupadte from bank
        * False: void
        */
} 

const getBalanceFromNordigen = () =>{
    //https://ob.nordigen.com/api/v2/accounts/${accountId}/balances/
    return   axios({
        method: 'GET',
        url: 'https://ob.nordigen.com/api/v2/accounts/609c3976-df41-4253-ae1a-6be551db8959/balances/',
        headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ0MzU2NDkxLCJqdGkiOiIzNDFhYjFlOTFiZTU0YmNlYTE0ZWY3NDBlNDFiOTljNyIsImlkIjo0ODc2LCJzZWNyZXRfaWQiOiIwZjE4MDBmNC1kOGNjLTQ0MzctYmEzNy00N2U2MTY2MTQyOTYiLCJhbGxvd2VkX2NpZHJzIjpbIjAuMC4wLjAvMCIsIjo6LzAiXX0.3QltRS5v5vp3iPy-MvdlpI7m4j4AkwFm3H9dmZhQTNo'
        }
    })
}