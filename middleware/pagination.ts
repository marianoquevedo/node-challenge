import { NextFunction, Request, Response } from 'express';

export interface Pagination {
  offset: number
  count: number
}

export interface PaginationResponse extends Pagination {
  total: number
}

export function createPaginationMiddleware(defaults = { offset: 0, count: 10 }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const offset = req.query.offset ? Number(req.query.offset) : defaults.offset;
    const count = req.query.count ? Number(req.query.count) : defaults.count;

    req.pagination = { offset, count };

    next();
  };
}
