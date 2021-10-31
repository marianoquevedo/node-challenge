export interface Pagination {
  offset: number
  count: number
}

export interface PaginationResponse extends Pagination {
  total: number
}
