import { Expense } from '../model';
import { GetExpensesRequest } from '../routes/v1-get-expenses-request';
import { getKnex, PaginatedQueryResult } from '@nc/utils/db';

export async function selectExpensesByUserId(params: GetExpensesRequest): Promise<PaginatedQueryResult<Expense>> {
  let baseQuery = getKnex()<Expense>('expenses').where('user_id', params.userId);
  const totalCount = await baseQuery.clone().count();

  // sorting
  baseQuery = baseQuery.orderBy(params.sort ?? 'date_created', params.sortDir ?? 'DESC');

  const rows = await baseQuery.clone()
    .offset(params.pagination.offset)
    .limit(params.pagination.count)
    .select();

  return {
    total: Number(totalCount[0].count),
    rows,
  };
}
