import { Request, Response, NextFunction } from "express";
import { getAllLoansService, createNewLoan, getLoanByIdService, updateLoanById, deleteLoanById } from "../services/resourceService";
import { HTTP_STATUS } from "../../../constants/httpConstants";


/**
 * Get all loan applications.
 * Calls the service to fetch all loans and returns them in the response.
 * @param req - Express request object (not used here)
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
export const getAllLoans = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {
        const loans = getAllLoansService()

        res.status(HTTP_STATUS.OK).json({
            message: "Loan applications retrieved",
            count: loans.length || 0,
            data: loans
        })

    } catch (error) {
        next(error)
    }
}


/**
 * Get a single loan by ID.
 * Calls the service to find the loan and returns it.
 * @param req - Express request object with loan ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
export const getLoanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const id = Number(req.params.id);

        const loan = await getLoanByIdService(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Loan retrieved",
            data: loan
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Create a new loan application.
 * Calls the service to create a loan with data from the request body.
 * @param req - Express request object with loan data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
export const createLoan = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {

        const loan = createNewLoan(req.body)

        res.status(HTTP_STATUS.CREATED).json({
            message: "Loan application created",
            data: loan
        })

    } catch (error) {
        next(error)
    }
}


/**
 * Update an existing loan application by ID.
 * Calls the service to update the loan, then fetches the updated loan to return.
 * @param req - Express request object with loan ID in params and update data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
export const updateLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const updateLoanDetails = req.body;

        await updateLoanById(id, updateLoanDetails);

        const updatedLoan = await getLoanByIdService(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Loan application updated",
            data: updatedLoan
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Delete a loan application by ID.
 * Calls the service to delete the loan and returns a confirmation message.
 * @param req - Express request object with loan ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 */
export const deleteLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const id = Number(req.params.id);

        await deleteLoanById(id);

        res.status(HTTP_STATUS.OK).json({
            message: `Loan ${id} was deleted`
        });

    } catch (error) {
        next(error);
    }
};