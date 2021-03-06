export interface IBill {
    friendlyName: string,
    text: string,
    when: {
        start: string,
        end: string
    },
    amount: string,
    paid: string,
    billType: string
}
