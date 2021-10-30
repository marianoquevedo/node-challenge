import { ApiError } from '@nc/utils/errors';
import { getExpensesByUserId } from '../model';
import { getUserDetails } from '../../user/model';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { Expense, ExpenseResponse } from '../types';

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

  return res.json(formatResponse(userExpenses));
});

function formatResponse(expenses: Expense[]): ExpenseResponse[] {
  return expenses.map((exp) => {
    return {
      id: exp.id,
      merchant_name: exp.merchant_name,
      amount_in_cents: exp.amount_in_cents,
      currency: exp.currency,
      date_created: exp.date_created,
      status: exp.status,
    };
  });
}
