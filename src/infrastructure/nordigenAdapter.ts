
import axios from 'axios'
import e from 'express'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import {  Jso } from '../apis/bills/bill.api'
import { updateBalanceDocument } from '../apis/userInfos/info.api'
import { Bill } from '../domain/user.domain'

let jwt = 'Bearer  '
let MyAccountID66 = '609c3976-df41-4253-ae1a-6be551db8959' //NOw hard coded, will be dynamic in prod 
let userBankSignInLink = 'undef'

//1

const selectJWT = () => jwt
const selectLink = () => userBankSignInLink
const selectMyAccountID66 = () => MyAccountID66
const requestJWT = async () => {
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
    return `Bearer ${jwt}`

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
    let res = await axios({
        method: 'GET',
        url: `https://ob.nordigen.com/api/v2/accounts/609c3976-df41-4253-ae1a-6be551db8959/balances/ `,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': _jwt
        }
    })
    console.info("good job bouhmid, your closingBookedbalance0 is:", res.data.balances[0].balanceAmount.amount)
    console.info("good job bouhmid, your interimAvailablebalance1 is:", res.data.balances[1].balanceAmount.amount)

    const interim = await getInterimFromBank(_jwt)
    console.info("Interim", interim)
    // return 1822.61 + interim
    return parseFloat(res.data.balances[0].balanceAmount.amount) + interim


}

 
export const getInterimFromBank = async (jwt: string) => {
    const myT: any[] = []
    let transactionsBank = await axios({
        method: 'GET',
        url: `https://ob.nordigen.com/api/v2/accounts/609c3976-df41-4253-ae1a-6be551db8959/transactions`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    })
    transactionsBank.data.transactions.pending.forEach((t: any) => {

        myT.push({
            name: t.creditorName,
            amount: parseFloat(t.transactionAmount.amount)

        })
    })

    let interim = 0
    myT.forEach(element => {
        interim = interim + element.amount
    })
    return interim
}
export const getTransactions = async (_jwt: string, start: moment.Moment) => {
    // // console.log(`Bearer ${_jwt}`)
    const startParamQuery = encodeURIComponent(start.format('YYYY-MM-DD'))

    console.info("start", startParamQuery)
    let res = await axios({
        method: 'GET',
        url: `https://ob.nordigen.com/api/v2/accounts/609c3976-df41-4253-ae1a-6be551db8959/transactions?date_from=${startParamQuery}`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': _jwt
        }
    })
    // console.info("TRANSACTI", res.data.transactions)
    const myT: Jso[] = []

    res.data.transactions.booked.forEach((t: any) => {

        myT.push({
            remittanceInformationStructured: t.remittanceInformationStructured,
            amount: parseFloat(t.transactionAmount.amount)
            ,
            creditorName: t.creditorName

        })
    })
    res.data.transactions.pending.forEach((t: any) => {

        myT.push({
            remittanceInformationStructured: t.remittanceInformationStructured,
            amount: parseFloat(t.transactionAmount.amount),
            creditorName: t.creditorName

        })
    })
    return myT
}
export interface TransactionConverted {
    remittanceInformationStructured: string|undefined;
    amount: number;
    creditorName: string|undefined;

}
const nordigen = {
    RequisitionId: MyAccountID66,
    userBankSignInLink,
    jwt,
    requestJWT,
    selectJWT,
    selectLink,
    createRequisition,
    requestBalance,
    getTransactions

}

export default nordigen



/**
 * 
 *    name: 'Barmenia Allgemeine Versicherungs AG                                  Barmenia-Allee 1',
    amoun
 * 
 */