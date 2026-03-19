export interface Loan {
    id: number
    applicant: string
    amount: number
    status: string
    createdAt: string
}

export type LoanInput = {
    applicant: string
    amount: number
}