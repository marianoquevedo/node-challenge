import { ApiError } from '@nc/utils/errors';
import { build } from './v1-get-expenses-response';
import { createPaginationMiddleware } from '../../../../middleware/pagination';
import { getExpensesByUserId } from '../model';
import { getUserDetails } from '../../user/model';
import { parse } from './v1-get-expenses-request';
import { Router } from 'express';
import { to } from '@nc/utils/async';

export const router = Router();

const usePagination = createPaginationMiddleware({ offset: 0, count: 20 });

router.get('/', usePagination, async (req, res, next) => {
  // TODO: validate inputs
  const params = parse(req);

  // check user
  const [errUser] = await to(getUserDetails(params.userId));
  if (errUser) {
    return next(errUser);
  }

  const [err, queryResult] = await to(getExpensesByUserId(params));
  if (err) {
    return next(new ApiError(err, err.status, `Error retrieving expenses: ${err}`, err.title, req));
  }

  const response = build(queryResult.rows, params.pagination, queryResult.total);
  return res.json(response);
});
