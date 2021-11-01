import config from 'config';
import { Knex, knex } from 'knex';

let knexInstance;

export interface PaginatedQueryResult<T> {
  total: number
  rows: T[]
}

export function getKnex(): Knex {
  if (!knexInstance) {
    knexInstance = knex({
      client: 'pg',
      connection: config.db,
    });
  }
  return knexInstance;
}
