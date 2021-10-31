import { ApiError } from '@nc/utils/errors';
import { build } from './v1-get-expenses-response';
import { getExpensesByUserId } from '../model';
import { getUserDetails } from '../../user/model';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { createPaginationMiddleware, Pagination } from '../../../../middleware/pagination';

export const router = Router();

const usePagination = createPaginationMiddleware({ offset: 0, count: 20 });

router.get('/', usePagination, async (req, res, next) => {
  // TODO: validate inputs
  const userId = req.query?.userId as string;
  const pagination = req.pagination as Pagination;

  // check user
  const [errUser] = await to(getUserDetails(userId));
  if (errUser) {
    return next(errUser);
  }

  const [err, queryResult] = await to(getExpensesByUserId(userId, pagination));
  if (err) {
    return next(new ApiError(err, err.status, `Error retrieving expenses: ${err}`, err.title, req));
  }

  const response = build(queryResult[1], pagination, queryResult[0]);
  return res.json(response);
});
