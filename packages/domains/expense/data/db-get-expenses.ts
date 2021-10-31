import { Expense } from '../model';
import { getKnex } from '@nc/utils/db';
import { Pagination } from '../../../../middleware/pagination';

export async function selectExpensesByUserId(userId: string, pagination: Pagination): Promise<[number, Expense[]]> {
  const baseQuery = getKnex()<Expense>('expenses').where('user_id', userId);

  const totalCount = await baseQuery.clone().count();
  const rows = await baseQuery.clone()
    .offset(pagination.offset)
    .limit(pagination.count).select();

  return [Number(totalCount[0].count), rows];
}
