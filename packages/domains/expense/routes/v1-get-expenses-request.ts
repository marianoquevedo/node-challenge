import { Pagination } from '../../../../middleware/pagination';
import { Request } from 'express';

export interface GetExpensesRequest {
  userId: string
  sort?: string
  sortDir?: string
  pagination?: Pagination
}

export function parse(req: Request): GetExpensesRequest {
  return {
    userId: req.query?.userId as string,
    pagination: req.pagination as Pagination,
    sort: req.query?.sort as string,
    sortDir: req.query?.sortDir as string,
  };
}
