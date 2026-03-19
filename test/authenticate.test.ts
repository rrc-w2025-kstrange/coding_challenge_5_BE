import { Request, Response, NextFunction } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { AppError } from "../src/api/v1/errors/errors";
import { auth as firebaseAuth } from "../src/config/firebaseConfig";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: { verifyIdToken: jest.fn() },
}));

describe("Authentication Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = { locals: {} };
    next = jest.fn();
  });

  it("throws error if no token", async () => {
    await authenticate(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next as jest.Mock).mock.calls[0][0].message).toMatch(/No token provided/);
  });

  it("throws error if token invalid", async () => {
    req.headers!.authorization = "Bearer invalidToken";
    (firebaseAuth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("Invalid"));
    await authenticate(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next as jest.Mock).mock.calls[0][0].message).toMatch(/Invalid token/);
  });

  it("sets res.locals.uid and role if token valid", async () => {
    req.headers!.authorization = "Bearer validToken";
    (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "123", role: "admin" });
    await authenticate(req as Request, res as Response, next);
    expect(res.locals!.uid).toBe("123");
    expect(res.locals!.role).toBe("admin");
    expect(next).toHaveBeenCalledWith();
  });
});
