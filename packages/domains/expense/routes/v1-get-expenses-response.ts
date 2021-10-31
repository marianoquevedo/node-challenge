import { Expense } from '../model';
import { Pagination, PaginationResponse } from '../../../../middleware/pagination';

interface ExpenseResponse {
  id: string
  merchant_name: string
  amount_in_cents: number
  currency: string
  date_created: string
  status: string
}

export interface GetExpensesResponse {
  expenses: ExpenseResponse[]
  pagination: PaginationResponse
}

export function build(expenses: Expense[], pagination: Pagination, total: number): GetExpensesResponse {
  return {
    expenses: expenses.map((exp) => {
      return {
        id: exp.id,
        merchant_name: exp.merchant_name,
        amount_in_cents: exp.amount_in_cents,
        currency: exp.currency,
        date_created: exp.date_created,
        status: exp.status,
      };
    }),
    pagination: {
      ...pagination,
      total,
    },
  };
}
