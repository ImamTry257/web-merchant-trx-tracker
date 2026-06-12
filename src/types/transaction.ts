export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'EXPIRED'

export interface Transaction {
  merchantId: string
  partnerReferenceNo: string
  referenceNumber: string
  amount: number
  status: TransactionStatus
  transactionDate: string
  paidDate: string | null
}

export interface TransactionFilter {
  merchantId?: string
  status?: TransactionStatus
  startDate?: string
  endDate?: string
  referenceNumber?: string
  partnerReferenceNumber?: string
}

export interface PaginationMeta {
  page: number
  size: number
  total: number
  totalPages: number
  nextPage: boolean
  previousPage: boolean
}

export interface TransactionResponse {
  data: Transaction[]
  meta: PaginationMeta
}

export interface ApiResponseEnvelope {
  responseCode: string
  responseMessage: string
  data: {
    meta: PaginationMeta
    contents: Transaction[]
  }
}

export interface ApiError {
  code: string
  message: string
}

export type ErrorType =
  | 'UNAUTHORIZED'
  | 'INVALID_SIGNATURE'
  | 'INVALID_TIMESTAMP'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNKNOWN'
