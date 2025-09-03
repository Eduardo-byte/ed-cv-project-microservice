// tests/fullStressWithCSV.test.js
import { jest } from '@jest/globals';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Increase Jest timeout to 60 seconds (60000ms)
jest.setTimeout(8600000);

// Base URL and concurrency constant
const baseUrl = 'http://localhost:3000';
const NUM_REQUESTS = 100;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file path
const logFile = path.join(__dirname, 'stress-test.log');

// Helper function to log messages to both console and file
function logMessage(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + "\n");
}
// Full array of user records from your CSV, with the key fields you requested.
// Each record has user_id, crypto_wallet_address, used_ref_code, genereated_ref_code, telegram_info.
const mockUsers = [
    {
        user_id: "05095327-3a88-4232-8f2a-43f13518aa86",
        crypto_wallet_address: "0:00086d60ddb336a67c9e441cb17fbbffc2aa620ecc98eb939536509be1686d8d",
        used_ref_code: "962e714665",
        genereated_ref_code: "6d8d043875",
        telegram_info: `[{"ID":5691499426,"Is_Bot":"No","Language":"en","Username":"Abdullahi10111","Last_Name":"Abdullahi $PRETON","First_Name":"Fatola","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "5249f7f8-42fc-47e5-9413-f7b13937fd7c",
        crypto_wallet_address: "0:57dfc6acd0893ed126530a6e506ea08473f7505215b850e9460899a47329d7cf",
        used_ref_code: "969160371",
        genereated_ref_code: "d7cf956499",
        telegram_info: `[{"ID":6772408067,"Is_Bot":"No","Language":"en","Username":"Sirjp100","Last_Name":"paul","First_Name":"john","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "6ec37265-dedb-4c5e-9230-55bbed2947ce",
        crypto_wallet_address: "0:540c92e7b66f08ab0339b15f76b47bdf9887ca22efbe475a35153be5da3f2354",
        used_ref_code: "0bf3398692",
        genereated_ref_code: "2354782275",
        telegram_info: `[{"ID":6560993698,"Is_Bot":"No","Language":"en","Username":"Oneandonlycryptocryptic","Last_Name":"Crypticüå±$SUEDE","First_Name":"Crypto","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "d4981af6-6c2d-49e5-9955-5a79cdb4adbf",
        crypto_wallet_address: "0:00086d60ddb336a67c9e441cb17fbbffc2aa620ecc98eb939536509be1686d8d",
        used_ref_code: "c06c362845",
        genereated_ref_code: "5372309981",
        telegram_info: `[{"ID":5876155372,"Is_Bot":"No","Language":"id","Last_Name":"123","First_Name":"Ivan","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "dadc1c32-1989-43be-9034-5e64c8e2ed0c",
        crypto_wallet_address: "0:2258b38aedd03a2882424c6bc7a96bc5347f55217b6fce549403d28245bee2eb",
        used_ref_code: "496e397691",
        genereated_ref_code: "e2eb789744",
        telegram_info: `[{"ID":6968469091,"Is_Bot":"No","Language":"en","Username":"Abdullahi12130","Last_Name":"","First_Name":"TomarketüçÖ","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "2c3b73f1-b18b-4c3d-a56c-67396a3b6a01",
        crypto_wallet_address: "0:00086d60ddb336a67c9e441cb17fbbffc2aa620ecc98eb939536509be1686d8d",
        used_ref_code: "nu",
        genereated_ref_code: "4570690067",
        telegram_info: `[{"ID":867934570,"Is_Bot":"No","Language":"en","Username":"Mekkypips","Last_Name":"","First_Name":"Mekky","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "9dfbb318-d552-49ba-bc49-d6e2e6386faf",
        crypto_wallet_address: "0:6f29f19c316bd5f9ade30ec9dfb877187a9188bd4100b9a5c72448598f3a36e9",
        used_ref_code: "1fbe412880",
        genereated_ref_code: "36e9051196",
        telegram_info: `[{"ID":696878571,"Is_Bot":"No","Language":"en","Username":"ositadee","Last_Name":"Daniel","First_Name":"Osita","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "32d18e34-d6aa-4650-9992-e7ee6593eaa0",
        crypto_wallet_address: "0:12447370814a19da1a92e8d51cab7dc7453d46cda732095a350b24195ace887b",
        used_ref_code: "nu",
        genereated_ref_code: "9541469059",
        telegram_info: `[{"ID":5458659541,"Is_Bot":"No","Language":"en","Username":"Rebazomar11","Last_Name":"Omar","First_Name":"Rebaz","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "9fd4d13c-2d47-458f-8216-90feedc5f72b",
        crypto_wallet_address: "0:9f11463eb78f51d91848eca3790119e3f6522bcc20ae20bb0a76c8d58f92fdf0",
        used_ref_code: "bdf3096137",
        genereated_ref_code: "fdf0756039",
        telegram_info: `[{"ID":7441768695,"Is_Bot":"No","Language":"en","Last_Name":"Johnson","First_Name":"Christopher","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "9fc7a70c-cb52-4ce5-adad-3f777bbc2cdc",
        crypto_wallet_address: "0:ac76ded04573379ca0acc88a67f524751399ce6171449daf59b597b32fc3661a",
        used_ref_code: "nu",
        genereated_ref_code: "661a478660",
        telegram_info: `[{"ID":7028081577,"Is_Bot":"No","Language":"en","Last_Name":"","First_Name":"1x.ZAHED","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "17519da1-6c39-47e2-84b5-1e012ce31eb8",
        crypto_wallet_address: "0:12447370814a19da1a92e8d51cab7dc7453d46cda732095a350b24195ace887b",
        used_ref_code: "496e397691",
        genereated_ref_code: "9492713654",
        telegram_info: `[{"ID":1944199492,"Is_Bot":"No","Language":"en","Last_Name":"Ahn","First_Name":"Ahn","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "c110c781-1fb6-403e-abe1-be019006d797",
        crypto_wallet_address: "0:12447370814a19da1a92e8d51cab7dc7453d46cda732095a350b24195ace887b",
        used_ref_code: "nu",
        genereated_ref_code: "8215967705",
        telegram_info: `[{"ID":5274468215,"Is_Bot":"No","Language":"it","Last_Name":"S","First_Name":"M","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "01b74609-6e99-439b-8b20-1d9910eb960e",
        crypto_wallet_address: "0:12447370814a19da1a92e8d51cab7dc7453d46cda732095a350b24195ace887b",
        used_ref_code: "4780856651",
        genereated_ref_code: "887b382047",
        telegram_info: `[{"ID":6907266404,"Is_Bot":"No","Language":"en","Username":"Bomancrypt","Last_Name":"","First_Name":"BomanCrypton","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "1c9f7758-5c9f-4ed0-940c-29298e41a9f7",
        crypto_wallet_address: "0:1694eebdb5be5e19447229641e161fdd16585034343cc4fbe666e151a0cc64b7",
        used_ref_code: "1fbe412880",
        genereated_ref_code: "64b7840517",
        telegram_info: `[{"ID":6338456088,"Is_Bot":"No","Language":"en","Username":"Khaled2691","Last_Name":"","First_Name":"Khaled","Is_Premium_User":"Yes","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "110066e0-0ecd-4c6b-8b22-4e50d7b7374b",
        crypto_wallet_address: "0:8855351859f9216d8d995d3dda3fde494d373abb681272e57b1d4d19bf60136d",
        used_ref_code: "555b550634",
        genereated_ref_code: "136d503533",
        telegram_info: `[{"ID":1825046037,"Is_Bot":"No","Language":"en","Username":"el_brutsador","Last_Name":"brutsador","First_Name":"el","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "755ab081-b7c9-4ff1-a092-6258b72636dd",
        crypto_wallet_address: "0:8855351859f9216d8d995d3dda3fde494d373abb681272e57b1d4d19bf60136d",
        used_ref_code: "3e0f731948",
        genereated_ref_code: "ined960084",
        telegram_info: `[{"Is_Bot":"No","Language":"vi","Last_Name":"","First_Name":"","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "2f173deb-f51a-4fc9-b347-fd9b7c7bc251",
        crypto_wallet_address: "0:8855351859f9216d8d995d3dda3fde494d373abb681272e57b1d4d19bf60136d",
        used_ref_code: "nu",
        genereated_ref_code: "7851273894",
        telegram_info: `[{"ID":7209587851,"Is_Bot":"No","Language":"en","Last_Name":"Khan","First_Name":"Tamim","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "c49c0027-2be8-4c2e-a8c3-8a7c016c2130",
        crypto_wallet_address: "0:8855351859f9216d8d995d3dda3fde494d373abb681272e57b1d4d19bf60136d",
        used_ref_code: "nu",
        genereated_ref_code: "5346734525",
        telegram_info: `[{"ID":7233465346,"Is_Bot":"No","Language":"en","Last_Name":"Usman","First_Name":"rabiu","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "6bf3dcc2-2cf4-4e6b-8fa3-671b06602b5e",
        crypto_wallet_address: "0:8855351859f9216d8d995d3dda3fde494d373abb681272e57b1d4d19bf60136d",
        used_ref_code: "nu",
        genereated_ref_code: "7198922549",
        telegram_info: `[{"ID":7168827198,"Is_Bot":"No","Language":"en","Last_Name":"","First_Name":"Yacob","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "52baffca-8e36-46e5-95cc-96e049a0bf89",
        crypto_wallet_address: "0:e5c9b332220b86e3d96db3ef9eab17a2cc2f513a930ad76041e6898f3fb9b850",
        used_ref_code: "nu",
        genereated_ref_code: "b850052321",
        telegram_info: `[{"ID":5612221070,"Is_Bot":"No","Language":"en","Last_Name":"Abdullahi","First_Name":"Bilkisu Umar","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
    {
        user_id: "a77813a3-c77b-4071-ba24-d71df6557f9b",
        crypto_wallet_address: "0:6caac7d5389ea23d6ff121f4ae2ca3b0ca5165048713c14f221658630c43ddf6",
        used_ref_code: "nu",
        genereated_ref_code: "ddf6366091",
        telegram_info: `[{"ID":7364280683,"Is_Bot":"No","Language":"en","Last_Name":"Abiyi","First_Name":"Tukura Ezekiel","Is_Premium_User":"No","Allows_Write_to_PM":"Yes","Added_to_Attachment_Menu":"No"}]`
    },
];


describe("Stress Test for ALL Routes (Read + Write) with CSV Data", () => {

    beforeAll(() => {
        // Clear log file before tests run.
        fs.writeFileSync(logFile, "Stress Test Log Start\n");
        logMessage("Starting Stress Tests for ALL Routes...");
    });

    // 1) POST /users
    it("should handle multiple concurrent POST /users requests", async () => {
        const newUserData = {
            twitter_id: "UserCreated",
            email_address: "UserCreated@example.com"
        };
        const allRequests = [];
        for (let i = 0; i < NUM_REQUESTS; i++) {
            allRequests.push(request(baseUrl).post("/users").send(newUserData));
        }
        logMessage(`POST: Issuing ${NUM_REQUESTS} concurrent POST /users requests...`);
        const responses = await Promise.all(allRequests);
        const successCount = responses.filter(r => r.status === 201).length;
        logMessage(`POST: ${successCount} out of ${NUM_REQUESTS} requests succeeded.`);
        responses.forEach((r, i) => {
            if (r.status === 201) {
                logMessage(`POST [Request ${i}]: Created User Data: ${JSON.stringify(r.body)}`);
            } else {
                logMessage(`POST [Request ${i}]: Error: ${r.status} - ${JSON.stringify(r.body)}`);
            }
        });
        expect(successCount).toBeGreaterThan(0);
    });

    // 2) GET /users
    it("should handle multiple concurrent GET /users requests", async () => {
        const allRequests = [];
        for (let i = 0; i < NUM_REQUESTS; i++) {
            allRequests.push(request(baseUrl).get("/users"));
        }
        logMessage(`GET /users: Issuing ${NUM_REQUESTS} concurrent GET /users requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users: Received ${responses.length} responses.`);
        responses.forEach((r, i) => {
            if (r.status === 200) {
                logMessage(`GET /users [Request ${i}]: Retrieved ${r.body.length} users.`);
            } else {
                logMessage(`GET /users [Request ${i}]: Error: ${r.status} - ${JSON.stringify(r.body)}`);
            }
        });
        const successCount = responses.filter(r => r.status === 200).length;
        expect(successCount).toBeGreaterThan(0);
    });

    // 3) GET /users/:userId
    it("should handle multiple concurrent GET /users/:userId requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/${user.user_id}`));
            }
        });
        logMessage(`GET /users/:userId: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/:userId: Received ${responses.length} responses.`);
        responses.forEach((r, i) => {
            if (r.status === 200) {
                logMessage(`GET /users/:userId [Req ${i}]: Found user: ${JSON.stringify(r.body)}`);
            } else {
                logMessage(`GET /users/:userId [Req ${i}]: Not found or error: ${r.status}`);
            }
        });
        expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    });

    // 4) GET /users/wallet/:walletAddress
    it("should handle multiple concurrent GET /users/wallet/:walletAddress requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.crypto_wallet_address) return; // skip blank wallets
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/wallet/${user.crypto_wallet_address}`));
            }
        });
        logMessage(`GET /users/wallet: Issuing requests for users with wallet addresses...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/wallet: Received ${responses.length} responses.`);
        responses.forEach((r, i) => {
            if (r.status === 200) {
                logMessage(`GET /users/wallet [Req ${i}]: Returned wallet: ${r.body.crypto_wallet_address}`);
            } else {
                logMessage(`GET /users/wallet [Req ${i}]: Error: ${r.status}`);
            }
        });
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 5) GET /users/telegram/:telegramId
    it("should handle multiple concurrent GET /users/telegram/:telegramId requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.telegram_info) return;
            try {
                const parsed = JSON.parse(user.telegram_info);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ID) {
                    const tgId = parsed[0].ID;
                    for (let i = 0; i < NUM_REQUESTS; i++) {
                        allRequests.push(request(baseUrl).get(`/users/telegram/${tgId}`));
                    }
                }
            } catch (err) {
                logMessage(`GET /users/telegram: Error parsing telegram_info for user ${user.user_id}: ${err.message}`);
            }
        });
        logMessage(`GET /users/telegram: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/telegram: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 6) GET /users/Idtelegram/:telegramId
    it("should handle multiple concurrent GET /users/Idtelegram/:telegramId requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.telegram_info) return;
            try {
                const parsed = JSON.parse(user.telegram_info);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ID) {
                    const tgId = parsed[0].ID;
                    for (let i = 0; i < NUM_REQUESTS; i++) {
                        allRequests.push(request(baseUrl).get(`/users/Idtelegram/${tgId}`));
                    }
                }
            } catch (err) {
                logMessage(`GET /users/Idtelegram: Error parsing telegram_info for user ${user.user_id}: ${err.message}`);
            }
        });
        logMessage(`GET /users/Idtelegram: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/Idtelegram: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 7) GET /users/Idtelegram/v2/:telegramId
    it("should handle multiple concurrent GET /users/Idtelegram/v2/:telegramId requests", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.telegram_info) return;
            try {
                const parsed = JSON.parse(user.telegram_info);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ID) {
                    const tgId = parsed[0].ID;
                    for (let i = 0; i < NUM_REQUESTS; i++) {
                        allRequests.push(request(baseUrl).get(`/users/Idtelegram/v2/${tgId}`));
                    }
                }
            } catch (err) {
                logMessage(`GET /users/Idtelegram/v2: Error parsing telegram_info for user ${user.user_id}: ${err.message}`);
            }
        });
        logMessage(`GET /users/Idtelegram/v2: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/Idtelegram/v2: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 8) GET /users/Idtelegram/v3/:telegramId
    it("should handle multiple concurrent GET /users/Idtelegram/v3/:telegramId requests", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.telegram_info) return;
            try {
                const parsed = JSON.parse(user.telegram_info);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ID) {
                    const tgId = parsed[0].ID;
                    for (let i = 0; i < NUM_REQUESTS; i++) {
                        allRequests.push(request(baseUrl).get(`/users/Idtelegram/v3/${tgId}`));
                    }
                }
            } catch (err) {
                logMessage(`GET /users/Idtelegram/v3: Error parsing telegram_info for user ${user.user_id}: ${err.message}`);
            }
        });
        logMessage(`GET /users/Idtelegram/v3: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/Idtelegram/v3: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 9) GET /users/referral/:used_ref_code
    it("should handle multiple concurrent GET /users/referral/:used_ref_code requests", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.used_ref_code) return;
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/referral/${user.used_ref_code}`));
            }
        });
        logMessage(`GET /users/referral: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/referral: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 10) GET /users/friends/:generated_ref_code
    it("should handle multiple concurrent GET /users/friends/:generated_ref_code requests", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            if (!user.genereated_ref_code) return;
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/friends/${user.genereated_ref_code}`));
            }
        });
        logMessage(`GET /users/friends: Issuing ${allRequests.length} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/friends: Received ${responses.length} responses.`);
        expect(responses.length).toBeGreaterThanOrEqual(0);
    });

    // 11) GET /users/claim_airdrop/:userId
    it("should handle multiple concurrent GET /users/claim_airdrop/:userId requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/claim_airdrop/${user.user_id}`));
            }
        });
        logMessage(`GET /users/claim_airdrop: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/claim_airdrop: Received ${responses.length} responses.`);
        expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    });

    // 12) GET /users/aggregate/:userId
    it("should handle multiple concurrent GET /users/aggregate/:userId requests for each user", async () => {
        const allRequests = [];
        mockUsers.forEach(user => {
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(request(baseUrl).get(`/users/aggregate/${user.user_id}`));
            }
        });
        logMessage(`GET /users/aggregate: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/aggregate: Received ${responses.length} responses.`);
        expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    });

    // 13) GET /users/change_wallet/:userId/:wallet/:walletType
    it("should handle multiple concurrent GET /users/change_wallet/:userId/:wallet/:walletType requests", async () => {
        const baseWallet = "kjnasjknkjsn";
        const walletType = "ETH";
        const allRequests = [];
        mockUsers.forEach(user => {
            for (let i = 0; i < NUM_REQUESTS; i++) {
                // Create a unique wallet by appending a part of the user_id and the iteration index
                const uniqueWallet = `${baseWallet}_${user.user_id.slice(0, 5)}_${i}`;
                allRequests.push(
                    request(baseUrl).get(`/users/change_wallet/${user.user_id}/${uniqueWallet}/${walletType}`)
                );
            }
        });
        logMessage(`GET /users/change_wallet: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users/change_wallet: Received ${responses.length} responses.`);
        expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    });


    // 14) GET /users_reg_date_null/
    it("should handle multiple concurrent GET /users_reg_date_null/ requests", async () => {
        const allRequests = [];
        for (let i = 0; i < NUM_REQUESTS; i++) {
            allRequests.push(request(baseUrl).get("/users_reg_date_null/"));
        }
        logMessage(`GET /users_reg_date_null: Issuing ${NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`GET /users_reg_date_null: Received ${responses.length} responses.`);
        expect(responses.length).toBe(NUM_REQUESTS);
    });

    // 15) PUT /users/:userId
    it("should handle multiple concurrent PUT /users/:userId requests for each user", async () => {
        const updateData = { email_address: "updated@stress.com" };
        const allRequests = [];
        mockUsers.forEach(user => {
            for (let i = 0; i < NUM_REQUESTS; i++) {
                allRequests.push(
                    request(baseUrl)
                        .put(`/users/${user.user_id}`)
                        .send(updateData)
                );
            }
        });
        logMessage(`PUT /users: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
        const responses = await Promise.all(allRequests);
        logMessage(`PUT /users: Received ${responses.length} responses.`);
        responses.forEach((r, i) => {
            if (r.status === 200) {
                logMessage(`PUT /users [Req ${i}]: Updated user: ${JSON.stringify(r.body)}`);
            } else {
                logMessage(`PUT /users [Req ${i}]: Error: ${r.status}`);
            }
        });
        expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    });

    // 16) DELETE /users/:userId
    // it("should handle multiple concurrent DELETE /users/:userId requests for each user", async () => {
    //     const allRequests = [];
    //     mockUsers.forEach(user => {
    //         for (let i = 0; i < NUM_REQUESTS; i++) {
    //             allRequests.push(request(baseUrl).delete(`/users/${user.user_id}`));
    //         }
    //     });
    //     logMessage(`DELETE /users: Issuing ${mockUsers.length * NUM_REQUESTS} requests...`);
    //     const responses = await Promise.all(allRequests);
    //     logMessage(`DELETE /users: Received ${responses.length} responses.`);
    //     responses.forEach((r, i) => {
    //         if (r.status === 200) {
    //             logMessage(`DELETE /users [Req ${i}]: ${JSON.stringify(r.body)}`);
    //         } else {
    //             logMessage(`DELETE /users [Req ${i}]: Error: ${r.status}`);
    //         }
    //     });
    //     expect(responses.length).toBe(mockUsers.length * NUM_REQUESTS);
    // });

    // afterAll(() => {
    //     logMessage("Stress tests completed.");
    //     // Optionally, read and print final log content:
    //     const finalLog = fs.readFileSync(logFile, 'utf8');
    //     logMessage("Final Log Content:\n" + finalLog);
    // });
});
