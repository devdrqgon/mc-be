import { v4 as uuidv4 } from 'uuid';

// +username 
// *              +Infos
// *                  -SalaryInfo
// *                  -Bills
// *               +Accounts
//                    -MainAccount
//                    -SavingAccount
//                +Config
//                    - Budget: Budget



// // Budget{
//     MonthlyBudget,
//     WeeklyBudget,
//     MoneyForfood,
//     MoneyForOthers,
//     Money For Bills,
// } 




export class User {

    username: string
    Infos: userPersonalInfos
    Config: UserConfig

    constructor(_username: string, _Config: UserConfig) {
        this.username = _username
        this.Infos = new userPersonalInfos(
            _username,
            null,
            null,
            [
                new Account(AccountType.main),
                new Account(AccountType.saving)
            ]
        )
        this.Config = _Config

    }

}



export class UserConfig {
    MoneyForBills: number
    MoneyForFood: number
    MoneyForOthers: number
    WeeklyBudget: number



    constructor(
        _MoneyForBills: number,
        _MoneyForFood: number,
        _WeeklyBudget: number,
        _MoneyForOthers: number
    ) {
        this.MoneyForBills = _MoneyForBills
        this.MoneyForFood = _MoneyForFood
        this.WeeklyBudget = _WeeklyBudget
        this.MoneyForOthers = _MoneyForOthers

    }


}
export class userPersonalInfos {

    internalId: string

    constructor(
        public _username: string,
        public salaryInfo: SalaryInfo | null,
        public Bills: Array<Bill> | null,
        public Accounts: Array<Account> | null
    ) {

        this.internalId = uuidv4()

    }
}

export class Bill {
    id: string

    constructor(sum: number,
        billName: number,
        username: string,
        paid: boolean,
        when: number) {
        this.id = uuidv4()
    }
}
export class SalaryInfo {
    salary: number
    dayOfMonth: number
    constructor(_salary: number, _DayOfMonthOfSalary: number) {
        this.dayOfMonth = _DayOfMonthOfSalary
        this.salary = _salary
    }
}

export enum AccountType {
    main = "main",
    saving = "saving"
}
export class Account {
    type: AccountType
    balance: number
    active: boolean

    constructor(type: AccountType) {
        this.type = type
        this.balance = 0
        this.active = false
    }
}
/** try to stay DDD 
 * this is Domain layer 
 * User has a a
 *              +username 
 *              +Infos
 *                  -SalaryInfo
 *                  -Bills
*               +Accounts
                    -MainAccount
                    -SavingAccount
                +Config
                    - Budget: Budget


// Budget{
    MonthlyBudget,
    WeeklyBudget,
    MoneyForfood,
    MoneyForOthers,
    Money For Bills,
} 
*/


export default interface IUser {
    username: string,
    password: string,
}

export interface IUserInfo {
    username: string,
    grossBalance: number,
    daySalary: number,
    foodBudget: number,
    miscBudget: number

}