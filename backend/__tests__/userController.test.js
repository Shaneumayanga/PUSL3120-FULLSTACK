const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const UserModel = require("../models/user.model");
const UserBookingModel = require("../models/user-booking.model");
const { generateToken } = require("../utils/jwt");

beforeAll(async () => {
  const url = `mongodb://127.0.0.1:27017/cinema-test`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      email: "shaneumayangatest123456@gmail.com",
      name: "shane umayanga",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
    expect(res.body.data).toHaveProperty("user_name", "shane umayanga");
  });

  it("should fail to register a user with an existing email", async () => {
    await UserModel.create({
      email: "shaneumayangatestduplicated123456@gmail.com",
      name: "shane duplicate",
      password: "password123",
    });

    const res = await request(app).post("/api/user/register").send({
      email: "shaneumayangatestduplicated123456@gmail.com",
      name: "shane duplicate",
      password: "password123",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("status", false);
    expect(res.body.data).toBe("please try a different email");
  });
});

describe("POST /api/login", () => {
  beforeAll(async () => {
    await UserModel.create({
      email: "shaneumayangalogintest123456@gmail.com",
      name: "shaneumayangalogintest",
      password: "password123",
    });
  });

  it("should log in an existing user", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "shaneumayangalogintest123456@gmail.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
    expect(res.body.data).toHaveProperty("access_token");
  });

  it("should fail to log in with an incorrect password", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "shaneumayangalogintest123456@gmail.com",
      password: "password123_wrongpassword",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("status", false);
    expect(res.body.data).toBe("Invalid email or password");
  });
});
