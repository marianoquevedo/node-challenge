import { Expense } from '../model';
import { GetExpensesRequest } from '../routes/v1-get-expenses-request';
import { getKnex, PaginatedQueryResult } from '@nc/utils/db';

export async function selectExpensesByUserId(params: GetExpensesRequest): Promise<PaginatedQueryResult<Expense>> {
  let baseQuery = getKnex()<Expense>('expenses')
    .where('user_id', params.userId);

  // filters
  if (params.status) {
    baseQuery = baseQuery.andWhere('status', params.status);
  }
  if (params.merchant_name) {
    baseQuery = baseQuery.andWhere('merchant_name', 'ILIKE', `%${params.merchant_name}%`);
  }

  // count of all rows without pagination
  const totalCount = await baseQuery.clone().count();

  // sort
  baseQuery = baseQuery.orderBy(params.sort, params.sortDir);

  // select
  const rows = await baseQuery.clone()
    .offset(params.offset)
    .limit(params.count)
    .select();

  return {
    total: Number(totalCount[0].count),
    rows,
  };
}
