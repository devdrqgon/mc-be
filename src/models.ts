export interface Bill {
    id: string,
    sum: number,
    text: number,
    userId: string,
    paid: boolean,
}

export interface Timespan {
    startDate: Date,
    endDate: Date,
    moneyToBeSaved: number,
    foodBudget: number,
    othersBudget: number,
    opsRef: Array<string>
}