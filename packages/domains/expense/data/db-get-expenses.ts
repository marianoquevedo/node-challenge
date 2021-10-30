import { query } from '@nc/utils/db';

export function selectExpensesByUserId(userId: string) {
  return query('SELECT * FROM expenses WHERE user_id=$1', [userId])
    .then((response) => response.rows);
}
