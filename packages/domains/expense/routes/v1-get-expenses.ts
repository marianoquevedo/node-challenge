import { ApiError } from '@nc/utils/errors';
import { format } from './v1-get-expenses-response';
import { getExpensesByUserId } from '../model';
import { getUserDetails } from '../../user/model';
import { Router } from 'express';
import { to } from '@nc/utils/async';

export const router = Router();

router.get('/', async (req, res, next) => {
  // TODO: validate inputs
  const userId = req.query?.userId as string;

  // check user
  const [errUser] = await to(getUserDetails(userId));
  if (errUser) {
    return next(errUser);
  }

  const [err, userExpenses] = await to(getExpensesByUserId(userId));
  if (err) {
    return next(new ApiError(err, err.status, `Error retrieving expenses: ${err}`, err.title, req));
  }

  if (!userExpenses) {
    return res.json({});
  }

  return res.json(format(userExpenses));
});
