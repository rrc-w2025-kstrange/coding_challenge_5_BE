import request from "supertest";
import app from "../src/app";
import { NextFunction, Request, Response } from "express";

// Mock middlewares so they just call next()
jest.mock("../src/api/v1/middleware/authenticate", () =>
  jest.fn((req: Request, _res: Response, next: NextFunction) => next())
);
jest.mock("../src/api/v1/middleware/authorize", () =>
  jest.fn(() => (req: Request, _res: Response, next: NextFunction) => next())
);

// Mock Firebase auth inline to avoid "before initialization" errors
jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    setCustomUserClaims: jest.fn(),
  },
}));

describe("Admin Routes", () => {
  let mockAuth: any;

  beforeAll(() => {
    // Grab the mocked auth after jest.mock runs
    mockAuth = require("../src/config/firebaseConfig").auth;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set custom claims for a user and return message", async () => {
    mockAuth.setCustomUserClaims.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post("/api/v1/admin/setCustomClaims")
      .send({
        uid: "user123",
        claims: { admin: true },
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Custom claims set for user: user123."
    );
  });

  it("should handle Firebase errors", async () => {
    mockAuth.setCustomUserClaims.mockRejectedValueOnce(new Error("Firebase error"));

    const response = await request(app)
      .post("/api/v1/admin/setCustomClaims")
      .send({
        uid: "user123",
        claims: { admin: true },
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body.error).toHaveProperty(
      "message",
      "An unexpected error occurred"
    );
    expect(response.body.error).toHaveProperty("code", "UNKNOWN_ERROR");
  });
});
