import { NewBill, NewUserInfoSchema, UserRepo } from "../../persistence/user/user.schemas"
import mongoose from 'mongoose'
import InMemoryBills from "../bills/data";

/**
 * temp: 
 * Update the userInfo doc with new bills model 
 */
export const initUserInfoDoc = async () => {

    let _bills: Array<NewBill> = []
    let _paypalBills: Array<NewBill> = []
    let _manualBills: Array<NewBill> = []


    InMemoryBills.myBills.forEach(b => {
        const j: NewBill = {
            friendlyName: b.friendlyName,
            username: 'amddev',
            paid: false,
            bankText: b.text,
            billType: b.billType,
            when: b.when,
            amount: b.amount
        }
        _bills.push(j)
    });

    
    InMemoryBills.paypalBills.forEach(b => {
        const j: NewBill = {
            friendlyName: b.friendlyName,
            username: 'amddev',
            paid: false,
            bankText: b.text,
            billType: b.billType,
            when: b.when,
            amount: b.amount
        }
        _paypalBills.push(j)
    });
    InMemoryBills.manualBills.forEach(b => {
        const j: NewBill = {
            friendlyName: b.friendlyName,
            username: 'amddev',
            paid: false,
            bankText: b.text,
            billType: b.billType,
            when: b.when,
            amount: b.amount
        }
        _manualBills.push(j)
    });
    const _userInfoDoc = new UserRepo.NewInfo({
        username: "amddev",
        salary: {
            amount: 3100,
            when: {
                start: 28,
                end: 30
            }
        },
        bills: _bills,
        paypalBills: _paypalBills,
        manualBills: _manualBills,
        accounts: [
            {
                accountType: "main",
                balance: 200
            },
            {
                accountType: "saving",
                balance: 0
            }
        ]
    })
    await _userInfoDoc.save();

    console.log(_userInfoDoc);
}