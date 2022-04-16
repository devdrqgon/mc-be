import logging from "../../infrastructure/logging";
import { BillsRepo } from "../../persistence/bills/bills.schemas";

export const sumOfEverything = () => {
    let sum = 0
    myBills.forEach(element => {
        sum = sum + element.amount
    });
    manualBills.forEach(element => {
        sum = sum + element.amount
    });

    return 400

}


export const sumOfUnpaid = () => {
    let sum = 0


    manualBills.forEach(element => {
        sum = sum + element.amount
    });

    return 700

}
/**
 * 03.04
 * current sparkasse balance: 1390
 * paypal: to be paid this month: 115.
 * paypal bills to be paid 126.7
 * bills: to be paid 448.7
 * netto left: 700
 */
const paypalBills = [
    {
        friendlyName: 'paypal waschmachine',
        text: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: 54.28,
        when: {
            start: 25,
            end: 27
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'paypal tische',
        text: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: 29.15,
        when: {
            start: 25,
            end: 27
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'paypal guitar',
        text: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: 22.5,
        when: {
            start: 8,
            end: 11
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'paypal ecollar',
        text: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: 10.98,
        when: {
            start: 23,
            end: 25
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'paypal jareya',
        text: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: 9.16,
        when: {
            start: 22,
            end: 24
        },
        billType: 'remittanceInformationStructured'

    }]
const myBills = [
    {
        friendlyName: 'GetSafe1',
        text: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
        amount: 5.15,
        when: {
            start: 1,
            end: 3
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'GetSafe2',
        text: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
        amount: 2.75,
        when: {
            start: 1,
            end: 3
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'Barmenia',
        text: 'Tier-OP-Kostenversicherung/Vertrag B301726026',
        amount: 60.30,
        when: {
            start: 25,
            end: 3
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'google',
        text: 'PP.7317.PP . Google, Ihr Einkauf bei Google',
        amount: 11.99,
        when: {
            start: 1,
            end: 2
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'grover laptop',
        text: 'PP.7317.PP . Grover Group GmbH, Ihr Einkauf bei Grover Group GmbH',
        amount: 54.9,
        when: {
            start: 20,
            end: 22
        },
        billType: 'remittanceInformationStructured'


    },
    {
        friendlyName: 'grover monitor',
        text: 'PP.7317.PP . Grover Group GmbH, Ihr Einkauf bei Grover Group GmbH',
        amount: 17.9,
        when: {
            start: 22,
            end: 24
        },
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'vodafone phone',
        text: 'Vodafone GmbH 40549 Duesseldorf',
        when: {
            start: 17,
            end: 18
        },
        amount: 54, //Varrying price
        billType: 'creditorName'

    },
    {
        friendlyName: 'vodafone internet',
        text: 'Vodafone Deutschland GmbH Beta-Str. 6-8',
        when: {
            start: 10,
            end: 12
        },
        amount: 54, //Varrying price
        billType: 'creditorName'

    },
    {
        friendlyName: 'mcfit',
        text: 'RSG Group GmbH Tannenberg 4 96132 SCHLUSSELFELD',
        when: {
            start: 1,
            end: 3
        },
        amount: 19.9,
        billType: 'creditorName'

    },
    {
        friendlyName: 'strom',
        text: 'Suewag Vertrieb AG CO.KG',
        when: {
            start: 25,
            end: 25
        },
        amount: 60,
        billType: 'creditorName'
    },
    {
        friendlyName: 'audible',
        text: 'AUDIBLE GMBH',
        when: {
            start: 16,
            end: 18
        }
        ,
        amount: 9.95,
        billType: 'creditorName'
    },
    {
        friendlyName: 'kinder',
        text: 'SOS-Kinderdörfer weltweit Hermann-Gmeiner-Fonds Deutschland e.V. Ridlerstr. 55',
        when: {
            start: 5,
            end: 9
        }
        ,
        amount: 20,
        billType: 'creditorName'
    }

]
const manualBills = [
    {
        friendlyName: 'dao1',
        text: 'PP.7317.PP . Bellami Tiernahrungs GmbH, Ihr Einkauf bei Bellami Tiernahrungs GmbH',
        when: {
            start: 27,
            end: 30
        },
        amount: 60,
        billType: 'remittanceInformationStructured'
    },
    {
        friendlyName: 'dao1',
        text: 'PP.7317.PP . Bellami Tiernahrungs GmbH, Ihr Einkauf bei Bellami Tiernahrungs GmbH',
        when: {
            start: 14,
            end: 16
        },
        amount: 60,
        billType: 'remittanceInformationStructured'

    },
    {
        friendlyName: 'rent',
        text: 'lulzim Ramadani',
        when: {
            start: 29,
            end: 31
        },
        amount: 850,
        billType: 'creditorName'
    },
    {
        friendlyName: 'gas',
        text: 'gas',
        when: {
            start: 25,
            end: 25
        },
        amount: 150,
        billType: 'creditorName'
    },

]



const InMemoryBills = {
    myBills,
    manualBills,
    paypalBills
}

export const saveBillsInDB = async () => {
    myBills.forEach(async b => {
        const doc = new BillsRepo.Bill({
            username: 'amddev',
            friendlyName: b.friendlyName,
            text: b.text,
            amount: b.amount,
            when: {
                start: b.when.start.toString(),
                end: b.when.end.toString()
            },
            paid: '0',
            billType: b.billType
        })

        await doc.save()

    })
}

export default InMemoryBills