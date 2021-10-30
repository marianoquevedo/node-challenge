import { Expense } from './types';
import { InternalError } from '@nc/utils/errors';
import { selectExpensesByUserId } from './data/db-get-expenses';
import { to } from '@nc/utils/async';

export async function getExpensesByUserId(userId: string): Promise<Expense[]> {
  const [dbError, rawExpenses] = await to(selectExpensesByUserId(userId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  return rawExpenses;
}
