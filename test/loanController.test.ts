import { Request, Response, NextFunction } from "express";
import * as loanController from "../src/api/v1/controllers/resourceController";
import * as loanService from "../src/api/v1/services/resourceService";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { AppError } from "../src/api/v1/errors/errors";

// Mock data for testing
const mockLoan = {
  id: 1,
  applicant: "John Smith",
  amount: 50000,
  status: "pending",
  createdAt: "2025-01-10T10:00:00.000Z",
};

describe("loanController unit tests", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFn = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("getAllLoans returns all loans with 200 status", () => {
    jest.spyOn(loanService, "getAllLoansService").mockReturnValue([mockLoan]);

    loanController.getAllLoans(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(loanService.getAllLoansService).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Loan applications retrieved",
      count: 1,
      data: [mockLoan],
    });
  });

  test("getLoanById returns a loan with 200 status", async () => {
    mockReq.params = { id: "1" };
    jest
      .spyOn(loanService, "getLoanByIdService")
      .mockResolvedValue(mockLoan);

    await loanController.getLoanById(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(loanService.getLoanByIdService).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Loan retrieved",
      data: mockLoan,
    });
  });

  test("getLoanById calls next with error when loan not found", async () => {
    mockReq.params = { id: "999" };
    const error = new AppError("Loan not found", "LOAN_NOT_FOUND", 404);
    jest
      .spyOn(loanService, "getLoanByIdService")
      .mockRejectedValue(error);

    await loanController.getLoanById(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(nextFn).toHaveBeenCalledWith(error);
  });

  test("createLoan creates a new loan with 201 status", () => {
    mockReq.body = { applicant: "John Smith", amount: 50000 };
    jest
      .spyOn(loanService, "createNewLoan")
      .mockReturnValue(mockLoan);

    loanController.createLoan(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(loanService.createNewLoan).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Loan application created",
      data: mockLoan,
    });
  });

  test("updateLoan updates a loan and returns 200 status", async () => {
    mockReq.params = { id: "1" };
    mockReq.body = { amount: 60000 };
    jest.spyOn(loanService, "updateLoanById").mockResolvedValue();
    jest.spyOn(loanService, "getLoanByIdService").mockResolvedValue(mockLoan);

    await loanController.updateLoan(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(loanService.updateLoanById).toHaveBeenCalledWith(1, {
      amount: 60000,
    });
    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Loan application updated",
      data: mockLoan,
    });
  });

  test("updateLoan calls next with error when loan not found", async () => {
    mockReq.params = { id: "999" };
    mockReq.body = { amount: 60000 };
    const error = new AppError("Loan not found", "LOAN_NOT_FOUND", 404);
    jest.spyOn(loanService, "updateLoanById").mockRejectedValue(error);

    await loanController.updateLoan(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(nextFn).toHaveBeenCalledWith(error);
  });

  test("deleteLoan deletes a loan and returns 200 status", async () => {
    mockReq.params = { id: "1" };
    jest.spyOn(loanService, "deleteLoanById").mockResolvedValue();

    await loanController.deleteLoan(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(loanService.deleteLoanById).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: `Loan 1 was deleted`,
    });
  });

  test("deleteLoan calls next with error when loan not found", async () => {
    mockReq.params = { id: "999" };
    const error = new AppError("Loan not found", "LOAN_NOT_FOUND", 404);
    jest.spyOn(loanService, "deleteLoanById").mockRejectedValue(error);

    await loanController.deleteLoan(
      mockReq as Request,
      mockRes as Response,
      nextFn
    );

    expect(nextFn).toHaveBeenCalledWith(error);
  });
});