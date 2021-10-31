import { Expense } from '../model';
import { GetExpensesRequest } from '../routes/v1-get-expenses-request';
import { getKnex, PaginatedQueryResult } from '@nc/utils/db';

export async function selectExpensesByUserId(params: GetExpensesRequest): Promise<PaginatedQueryResult<Expense>> {
  const baseQuery = getKnex()<Expense>('expenses')
    .where('user_id', params.userId)
    .orderBy(params.sort, params.sortDir);

  const totalCount = await baseQuery.clone().count();

  const rows = await baseQuery.clone()
    .offset(params.offset)
    .limit(params.count)
    .select();

  return {
    total: Number(totalCount[0].count),
    rows,
  };
}
