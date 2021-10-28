export interface Bill {
    id: string,
    sum: number,
    text: number,
    userId: string,
    paid: boolean,
}

export interface TimeSpanPlan {
    startDate: Date,
    endDate: Date,
    moneyToBeSaved: number,
    foodBudget: number,
    othersBudget: number,
    opsRef: Array<string>,
    userId: string
}