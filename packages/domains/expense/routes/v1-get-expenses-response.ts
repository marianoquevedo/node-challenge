import { Expense } from '../model';

export interface GetExpensesResponse {
  id: string
  merchant_name: string
  amount_in_cents: number
  currency: string
  date_created: string
  status: string
}

export function format(expenses: Expense[]): GetExpensesResponse[] {
  return expenses.map((exp) => {
    return {
      id: exp.id,
      merchant_name: exp.merchant_name,
      amount_in_cents: exp.amount_in_cents,
      currency: exp.currency,
      date_created: exp.date_created,
      status: exp.status,
    };
  });
}
