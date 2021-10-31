import { Expense } from '../model';
import { GetExpensesRequest } from './v1-get-expenses-request';
import { PaginationResponse } from '@nc/utils/pagination';

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

export function build(expenses: Expense[], total: number, params: GetExpensesRequest): GetExpensesResponse {
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
      offset: params.offset,
      count: params.count,
      total,
    },
  };
}
