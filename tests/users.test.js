import request from 'supertest';
import express from 'express';
import router from '../routes/users.js';
import UserService from '../services/userService.js';

// Mock the UserService module so that we can control its behavior
jest.mock('../services/userService.js');

const app = express();
app.use(express.json());
app.use('/', router);

describe("Users API Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /users
    describe("POST /users", () => {
        it("should create a new user and return 201", async () => {
            const newUser = { user_id: "1", twitter_id: "123", email_address: "test@example.com" };
            UserService.createUser.mockResolvedValue(newUser);

            const res = await request(app)
                .post("/")
                .send({ twitter_id: "123", email_address: "test@example.com" });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(newUser);
        });

        it("should return 400 if there is an error creating the user", async () => {
            UserService.createUser.mockRejectedValue(new Error("Error creating user"));

            const res = await request(app)
                .post("/")
                .send({ twitter_id: "123", email_address: "test@example.com" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Error creating user" });
        });
    });

    // GET /users
    describe("GET /users", () => {
        it("should retrieve all users", async () => {
            const users = [{ user_id: "1" }, { user_id: "2" }];
            UserService.getUsers.mockResolvedValue(users);

            const res = await request(app).get("/");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 400 if there is an error retrieving users", async () => {
            UserService.getUsers.mockRejectedValue(new Error("Error getting users"));

            const res = await request(app).get("/");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Error getting users" });
        });
    });

    // GET /users/:userId
    describe("GET /users/:userId", () => {
        it("should retrieve a user by ID", async () => {
            const user = { user_id: "1", email_address: "test@example.com" };
            UserService.getUserById.mockResolvedValue(user);

            const res = await request(app).get("/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(user);
        });

        it("should return 404 if user is not found", async () => {
            UserService.getUserById.mockResolvedValue(null);

            const res = await request(app).get("/1");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });
    });

    // GET /users/wallet/:walletAddress
    describe("GET /users/wallet/:walletAddress", () => {
        it("should retrieve a user by wallet address", async () => {
            const user = { user_id: "1", crypto_wallet_address: "0xabc" };
            UserService.getUserByWallet.mockResolvedValue(user);

            const res = await request(app).get("/wallet/0xabc");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(user);
        });

        it("should return 404 if no user found by wallet address", async () => {
            UserService.getUserByWallet.mockResolvedValue(null);

            const res = await request(app).get("/wallet/0xabc");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });
    });

    // GET /users/telegram/:telegramId
    describe("GET /users/telegram/:telegramId", () => {
        it("should retrieve a user by Telegram ID", async () => {
            const user = { user_id: "1", telegram_id: "tg123" };
            UserService.getUserByTelegram.mockResolvedValue(user);

            const res = await request(app).get("/telegram/tg123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(user);
        });

        it("should return 404 if no user found by Telegram ID", async () => {
            UserService.getUserByTelegram.mockResolvedValue(null);

            const res = await request(app).get("/telegram/tg123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });
    });

    // GET /users/Idtelegram/:telegramId
    describe("GET /users/Idtelegram/:telegramId", () => {
        it("should retrieve users by Telegram ID (Method 1)", async () => {
            const users = [{ user_id: "1" }, { user_id: "2" }];
            UserService.getUserByIdTelegram.mockResolvedValue(users);

            const res = await request(app).get("/Idtelegram/tg123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 404 if no users found (Method 1)", async () => {
            UserService.getUserByIdTelegram.mockResolvedValue([]);
            const res = await request(app).get("/Idtelegram/tg123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "No users found with the given Telegram ID" });
        });
    });

    // GET /users/Idtelegram/v2/:telegramId
    describe("GET /users/Idtelegram/v2/:telegramId", () => {
        it("should retrieve users by Telegram ID (Method v2)", async () => {
            const users = [{ user_id: "1" }];
            UserService.getUserByIdTelegramV2.mockResolvedValue(users);

            const res = await request(app).get("/Idtelegram/v2/tg123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 404 if no users found (Method v2)", async () => {
            UserService.getUserByIdTelegramV2.mockResolvedValue([]);
            const res = await request(app).get("/Idtelegram/v2/tg123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "No users found with the given Telegram ID" });
        });
    });

    // GET /users/Idtelegram/v3/:telegramId
    describe("GET /users/Idtelegram/v3/:telegramId", () => {
        it("should retrieve users by Telegram ID (Method v3)", async () => {
            const users = [{ user_id: "1" }];
            UserService.getUserByIdTelegramV3.mockResolvedValue(users);

            const res = await request(app).get("/Idtelegram/v3/tg123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 404 if no users found (Method v3)", async () => {
            UserService.getUserByIdTelegramV3.mockResolvedValue([]);
            const res = await request(app).get("/Idtelegram/v3/tg123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "No users found with the given Telegram ID" });
        });
    });

    // GET /users/referral/:used_ref_code
    describe("GET /users/referral/:used_ref_code", () => {
        it("should retrieve a user by referral code", async () => {
            const user = { user_id: "1" };
            UserService.getUserByReferral.mockResolvedValue(user);

            const res = await request(app).get("/referral/REF123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(user);
        });

        it("should return 404 if user not found by referral code", async () => {
            UserService.getUserByReferral.mockResolvedValue(null);

            const res = await request(app).get("/referral/REF123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });
    });

    // GET /users/friends/:generated_ref_code
    describe("GET /users/friends/:generated_ref_code", () => {
        it("should retrieve users by generated referral code", async () => {
            const users = [{ user_id: "1" }];
            UserService.getUsersByGeneratedReferral.mockResolvedValue(users);

            const res = await request(app).get("/friends/GENREF123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 404 if no users found by generated referral code", async () => {
            UserService.getUsersByGeneratedReferral.mockResolvedValue([]);
            const res = await request(app).get("/friends/GENREF123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "No users found" });
        });
    });

    // GET /users/claim_airdrop/:userId
    describe("GET /users/claim_airdrop/:userId", () => {
        it("should return claim result when user is found", async () => {
            const result = { success: true, message: "Claimed", data: { user_id: "1" } };
            UserService.getUsersByUserId.mockResolvedValue(result);

            const res = await request(app).get("/claim_airdrop/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(result);
        });

        it("should return 404 if no user found for airdrop", async () => {
            UserService.getUsersByUserId.mockResolvedValue(null);

            const res = await request(app).get("/claim_airdrop/1");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "No users found" });
        });
    });

    // GET /users/aggregate/:userId
    describe("GET /users/aggregate/:userId", () => {
        it("should return aggregation result", async () => {
            const result = { success: true, message: "Aggregated", data: [] };
            UserService.aggregateUsers.mockResolvedValue(result);

            const res = await request(app).get("/aggregate/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(result);
        });

        it("should return 400 if aggregation errors", async () => {
            UserService.aggregateUsers.mockRejectedValue(new Error("Aggregation error"));

            const res = await request(app).get("/aggregate/1");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Aggregation error" });
        });
    });

    // GET /users/change_wallet/:userId/:wallet/:walletType
    describe("GET /users/change_wallet/:userId/:wallet/:walletType", () => {
        it("should return wallet change result", async () => {
            const result = { success: true, message: "Wallet changed" };
            UserService.changeWallet.mockResolvedValue(result);

            const res = await request(app).get("/change_wallet/1/0xabc/ETH");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(result);
        });

        it("should return 400 if wallet change fails", async () => {
            UserService.changeWallet.mockRejectedValue(new Error("Wallet error"));

            const res = await request(app).get("/change_wallet/1/0xabc/ETH");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Wallet error" });
        });
    });

    // GET /users_reg_date_null/
    describe("GET /users_reg_date_null/", () => {
        it("should return updated users with non-null registration_date", async () => {
            const users = [{ user_id: "1", registration_date: "2025-02-18T00:00:00Z" }];
            UserService.getNullUsers.mockResolvedValue(users);

            const res = await request(app).get("/users_reg_date_null/");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it("should return 400 if updating registration_date fails", async () => {
            UserService.getNullUsers.mockRejectedValue(new Error("Error updating registration_date"));

            const res = await request(app).get("/users_reg_date_null/");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Error updating registration_date" });
        });
    });
});
