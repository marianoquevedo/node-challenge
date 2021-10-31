import { GetExpensesRequest } from './routes/v1-get-expenses-request';
import { InternalError } from '@nc/utils/errors';
import { PaginatedQueryResult } from '@nc/utils/db';
import { selectExpensesByUserId } from './data/db-get-expenses';
import { to } from '@nc/utils/async';

export interface Expense {
  id: string
  merchant_name: string
  amount_in_cents: number
  currency: string
  user_id: string
  date_created: string
  status: string
}

export async function getExpensesByUserId(params: GetExpensesRequest): Promise<PaginatedQueryResult<Expense>> {
  const [dbError, result] = await to(selectExpensesByUserId(params));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  return result;
}
