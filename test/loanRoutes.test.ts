import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
// Mock middlewares to isolate controller behavior
jest.mock("../src/api/v1/middleware/authenticate", () =>
  jest.fn((req: Request, _res: Response, next: NextFunction) => next())
);

jest.mock("../src/api/v1/middleware/authorize", () =>
  jest.fn(() => (req: Request, _res: Response, next: NextFunction) => next())
);

describe("Loan Routes", () => {
  it("GET /api/v1/loans should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/loans");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("data");
  });

  it("GET /api/v1/loans/:id should return 200 OK for valid ID", async () => {
    const res = await request(app).get("/api/v1/loans/1");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id", 1);
  });

  it("POST /api/v1/loans should create a new loan", async () => {
    const newLoan = { applicant: "Test User", amount: 10000 };
    const res = await request(app).post("/api/v1/loans").send(newLoan);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("applicant", "Test User");
  });

  it("PUT /api/v1/loans/:id should update an existing loan", async () => {
    const update = { amount: 99999 };
    const res = await request(app).put("/api/v1/loans/1").send(update);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("amount", 99999);
  });

  it("DELETE /api/v1/loans/:id should delete a loan", async () => {
    const res = await request(app).delete("/api/v1/loans/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});