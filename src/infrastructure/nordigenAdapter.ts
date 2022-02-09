
import axios from 'axios'
let jwt = 'Bearer  '
let RequisitionId
let userBankSignInLink
//1


const getAccessToken = async () => {
    try{
        let res = await   axios({
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
       console.log(jwt)
    }
    catch(e){
        console.error(e)
    }

}

const nordigen = {
    RequisitionId,
    userBankSignInLink,
    jwt,
    getAccessToken,

}

export default nordigen