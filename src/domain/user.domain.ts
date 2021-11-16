import { randomUUID } from "crypto"

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


class User {

    username: string
    Infos: UserInfo
    Accounts: Array<Account>
    Config: UserConfig

    constructor(_username: string, _Config: UserConfig) {
        this.username = _username
        this.Infos = new UserInfo()
        this.Accounts = [
            new Account(AccountType.main),
            new Account(AccountType.saving)
        ]
        this.Config = _Config

    }

}


class UserConfig {
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
class UserInfo {
    internalId: string
    salaryInfo: SalaryInfo | null
    Bills: Array<Bill> | null
    constructor() {
        this.salaryInfo = null
        this.Bills = null
        this.internalId = randomUUID()
    }
}

class Bill {
    id: string
    constructor() {
        this.id = randomUUID()
    }
}
class SalaryInfo {
    salary: number
    DayOfMonthOfSalary: number
    constructor(_salary: number, _DayOfMonthOfSalary: number) {
        this.DayOfMonthOfSalary = _DayOfMonthOfSalary
        this.salary = _salary
    }
}

enum AccountType {
    main = "main",
    saving = "saving"

}
class Account {
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