import { InternalError } from '@nc/utils/errors';
import { Pagination } from '../../../middleware/pagination';
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

export async function getExpensesByUserId(userId: string, pagination: Pagination): Promise<[number, Expense[]]> {
  const [dbError, result] = await to(selectExpensesByUserId(userId, pagination));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  return result;
}
