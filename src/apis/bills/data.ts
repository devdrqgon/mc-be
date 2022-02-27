
const remittanceInformationStructuredAndPrice = [
    {
        friendlyName: 'GetSafe1',
        remittanceInformationStructured: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
        amount: -5.15,
        when: {
            start: 1,
            end: 3
        }

    },
    {
        friendlyName: 'GetSafe2',
        remittanceInformationStructured: 'PP.7317.PP . Getsafe Digital GmbH, Ihr Einkauf bei Getsafe Digital GmbH',
        amount: -2.75,
        when: {
            start: 1,
            end: 3
        }

    },
    {
        friendlyName: 'Barmenia',
        remittanceInformationStructured: 'Tier-OP-Kostenversicherung/Vertrag B301726026',
        amount: -60.30,
        when: {
            start: 25,
            end: 3
        }
    },
    {
        friendlyName: 'paypal waschmachine',
        remittanceInformationStructured: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: -54.28,
        when: {
            start: 25,
            end: 27
        }
    },
    {
        friendlyName: 'paypal tische',
        remittanceInformationStructured: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: -29.15,
        when: {
            start: 25,
            end: 27
        }
    },
    {
        friendlyName: 'paypal guitar',
        remittanceInformationStructured: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: -22.5,
        when: {
            start: 8,
            end: 11
        }
    },
    {
        friendlyName: 'paypal bed',
        remittanceInformationStructured: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: -60.54,
        when: {
            start: 30,
            end: 1
        }
    },
    {
        friendlyName: 'paypal jareya',
        remittanceInformationStructured: '. PAYPAL-ZAHLUNG UBER LASTSCHRIFT an',
        amount: -9.16,
        when: {
            start: 22,
            end: 24
        }
    },
    {
        friendlyName: 'grover laptop',
        remittanceInformationStructured: 'PP.7317.PP . Grover Group GmbH, Ihr Einkauf bei Grover Group GmbH',
        amount: -54.9,
        when: {
            start: 20,
            end: 22
        }

    },
    {
        friendlyName: 'grover monitor',
        remittanceInformationStructured: 'PP.7317.PP . Grover Group GmbH, Ihr Einkauf bei Grover Group GmbH',
        amount: -17.9,
        when: {
            start: 22,
            end: 24
        }
    }

]
const manualBills = [
    {
        friendlyName: 'dao1',
        remittanceInformationStructured: 'PP.7317.PP . Bellami Tiernahrungs GmbH, Ihr Einkauf bei Bellami Tiernahrungs GmbH', 
        when: {
            start: 27,
            end: 30
        }
    },
    {
        friendlyName: 'dao1',
        remittanceInformationStructured: 'PP.7317.PP . Bellami Tiernahrungs GmbH, Ihr Einkauf bei Bellami Tiernahrungs GmbH', 
        when: {
            start: 14,
            end: 16
        }
    },
    {
        friendlyName: 'rent',
        CreditorName: 'lulzim Ramadani', 
        when: {
            start: 29,
            end: 31
        }
    }
]
const CreditorNameNoPrice = [
   
    {
        friendlyName: 'vodafone phone',
        CreditorName: 'Vodafone GmbH 40549 Duesseldorf',
        when: {
            start: 17,
            end: 18
        }
    },
    {
        friendlyName: 'vodafone internet',
        CreditorName: 'Vodafone Deutschland GmbH Beta-Str. 6-8',
         when: {
            start: 10,
            end: 12
        }
    },
    {
        friendlyName: 'mcfit',
        CreditorName: 'RSG Group GmbH Tannenberg 4 96132 SCHLUSSELFELD',
        when: {
           start: 1,
           end: 3
       }
    },
    {
        friendlyName: 'strom',
        CreditorName: 'Suewag Vertrieb AG CO.KG',
        when: {
           start: 25,
           end: 25
       }
    },
    {
        friendlyName: 'audible',
        CreditorName: 'AUDIBLE GMBH',
        when: {
           start: 16,
           end: 18
       }
    },
    {
        friendlyName: 'kinder',
        CreditorName: 'SOS-Kinderdörfer weltweit Hermann-Gmeiner-Fonds Deutschland e.V. Ridlerstr. 55',
        when: {
           start: 5,
           end: 9
       }
    },
]


 
const InMemoryBills = {
    remittanceInformationStructuredAndPrice,
    manualBills,
    CreditorNameNoPrice

}
export default InMemoryBills