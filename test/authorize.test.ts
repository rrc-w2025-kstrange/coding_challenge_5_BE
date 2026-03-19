import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("Authorization Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { params: { id: "123" } };
    res = { locals: {} };
    next = jest.fn();
  });

  it("allows user with correct role", () => {
    res.locals!.role = "admin";
    const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: false });
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("throws error if role missing", () => {
    const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: false });
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
  });

  it("throws error if role not allowed", () => {
    res.locals!.role = "user";
    const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: false });
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
  });

  it("allows same user if allowSameUser is true", () => {
    res.locals!.uid = "123";
    const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });
});
