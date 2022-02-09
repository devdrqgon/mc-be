const client = new NordigenClient({
    secretId: '0f1800f4-d8cc-4437-ba37-47e616614296',
    secretKey: '71055029e59a706f83faa0cddaea608a224728cc832f3cd9a3737d8eda2d5684bd3381363b9a183ac15257ac85077f404bd52f2c1de515027f584ae8b95d90a1'
});


// Generate new access token. Token is valid for 24 hours
const tokenData = await client.generateToken();

// Get access and refresh token
// Note: access_token is automatically injected to other requests after you successfully obtain it
const token = tokenData.access;
const refreshToken = tokenData.refresh;

// Exchange refresh token. Refresh token is valid for 30 days
const newToken = await client.exchangeToken({refreshToken: refreshToken});

// Use existing token
client.setToken(process.env.TOKEN);

// Get list of institutions
const institutions = await client.institution.getInstitutions({country: "LV"});

// Institution id can be gathered from getInstitutions response.
// Example Revolut ID
const institutionId = "REVOLUT_REVOGB21";

// Initialize new bank session
const init = await client.initSession({
    redirectUrl: "https://nordigen.com",
    institutionId: institutionId,
    referenceId: randomUUID()
})

// Get link to authorize in the bank
// Authorize with your bank via this link, to gain access to account data
const link = init.link;
// requisition id is needed to get accountId in the next step
const requisitionId = init.id;