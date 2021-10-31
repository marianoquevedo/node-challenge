export interface Pagination {
  offset: number
  limit: number
}

export interface PaginationResponse extends Pagination {
  total: number
}
