import { getKnex } from '@nc/utils/db';

export function readUser(userId) {
  return getKnex().table('users')
    .where('id', userId)
    .first();
}
