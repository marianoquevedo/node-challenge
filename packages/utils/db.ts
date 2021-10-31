import { Client } from 'pg';
import config from 'config';
import { Knex, knex } from 'knex';

let db;
let knexInstance;

export function connect() {
  db = new Client(config.db);
  return db.connect();
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

export async function query(queryString: string, parameters?: any) {
  if (!db) await connect();

  return db.query(queryString, parameters);
}
