import { ApiError } from '@nc/utils/errors';
import { build } from './v1-get-expenses-response';
import { getExpensesByUserId } from '../model';
import { getUserDetails } from '../../user/model';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { validate } from './v1-get-expenses-request';

export const router = Router();

router.get('/', async (req, res, next) => {
  const [validationErr, params] = validate(req);
  if (validationErr) {
    return next(validationErr);
  }

  // check user
  const [errUser] = await to(getUserDetails(params.userId));
  if (errUser) {
    return next(errUser);
  }

  const [err, queryResult] = await to(getExpensesByUserId(params));
  if (err) {
    return next(new ApiError(err, err.status, `Error retrieving expenses: ${err}`, err.title, req));
  }

  const response = build(queryResult.rows, queryResult.total, params);
  return res.json(response);
});
