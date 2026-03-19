import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Loan, LoanInput } from "../models/loan.model";

/**
 * Sample in-memory loan data to simulate a database.
 */
let loans: Loan[] = [
    {
        id: 1,
        applicant: "John Smith",
        amount: 50000,
        status: "pending",
        createdAt: "2025-01-10T10:00:00.000Z",
    },
    {
        id: 2,
        applicant: "Sarah Johnson",
        amount: 150000,
        status: "under_review",
        createdAt: "2025-01-08T10:00:00.000Z",
    },
    {
        id: 3,
        applicant: "Michael Chen",
        amount: 500000,
        status: "pending",
        createdAt: "2025-01-05T10:00:00.000Z",
    },
    {
        id: 4,
        applicant: "Emily Williams",
        amount: 1000000,
        status: "flagged",
        createdAt: "2025-01-03T10:00:00.000Z",
    },
];


/**
 * Returns all loan applications in the system.
 * @returns An array of Loan objects.
 */
export const getAllLoansService = (): Loan[] => {
    return loans
}


/**
 * Returns a single loan application by ID.
 * @param id - The ID of the loan to find.
 * @returns The Loan object matching the ID.
 * @throws AppError if no loan is found with that ID.
 */
export const getLoanByIdService = async (id: number): Promise<Loan> => {
    const loan = loans.find(loan => loan.id === id);

    if (!loan) {
        throw new AppError(
            "Loan application not found",
            "LOAN_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    return loan;
};



/**
 * Creates a new loan application.
 * @param loanData - The input data for the new loan (applicant name and amount).
 * @returns The created Loan object including a new ID, status, and timestamp.
 */
export const createNewLoan = (loanData: LoanInput): Loan => {
    const nextId =
        loans.length > 0
            ? Math.max(...loans.map(loan => loan.id)) + 1
            : 1

    const newLoan: Loan = {
        id: nextId,
        applicant: loanData.applicant,
        amount: loanData.amount,
        status: "pending",
        createdAt: new Date().toISOString()
    }

    loans.push(newLoan)

    return newLoan
}

/**
 * Updates a loan application by ID with new details.
 * @param id - The ID of the loan to update.
 * @param updateLoanDetails - Partial data to update (any Loan fields).
 * @throws AppError if no loan is found with that ID.
 */
export const updateLoanById = async (id: number, updateLoanDetails: Partial<Loan>): Promise<void> => {

    const loan = loans.find(loan => loan.id === id);

    if (!loan) {
        throw new AppError(
            "Loan application not found",
            "LOAN_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    Object.assign(loan, updateLoanDetails);
};


/**
 * Deletes a loan application by ID.
 * @param id - The ID of the loan to delete.
 * @throws AppError if no loan is found with that ID.
 */
export const deleteLoanById = async (id: number): Promise<void> => {

    const index = loans.findIndex(loan => loan.id === id);

    if (index === -1) {
        throw new AppError(
            "Loan application not found",
            "LOAN_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    loans.splice(index, 1);
};