import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  TransactionFilter,
  TransactionResponse,
  ErrorType,
  ApiResponseEnvelope,
} from '../types/transaction'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const MERCHANT_TOKEN = import.meta.env.VITE_MERCHANT_TOKEN ?? 'merchant-demo-token'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function buildQueryString(filter: TransactionFilter, page: number, size: number): string {
  const params = new URLSearchParams()

  params.append('page', String(page))
  params.append('size', String(size))

  if (filter.merchantId) params.append('merchantId', filter.merchantId)
  if (filter.status) params.append('status', filter.status)
  if (filter.startDate) params.append('startDate', filter.startDate)
  if (filter.endDate) params.append('endDate', filter.endDate)
  if (filter.referenceNumber) params.append('referenceNumber', filter.referenceNumber)
  if (filter.partnerReferenceNumber) params.append('partnerReferenceNumber', filter.partnerReferenceNumber)

  return params.toString()
}

export async function fetchTransactions(
  filter: TransactionFilter,
  page: number = 1,
  size: number = 5
): Promise<TransactionResponse> {
  const queryString = buildQueryString(filter, page, size)
  const pathWithQuery = `/api/v1/merchant/transactions?${queryString}`

  const requestHeaders = {
    Authorization: `Bearer ${MERCHANT_TOKEN}`,
  }

  const response = await apiClient.get<ApiResponseEnvelope>(pathWithQuery, {
    headers: requestHeaders,
  })

  return {
    data: response.data.data.contents,
    meta: response.data.data.meta,
  }
}

export function mapAxiosError(error: AxiosError): ErrorType {
  if (!error.response) return 'UNKNOWN'

  const responseData = error.response.data as { code?: string } | undefined
  const errorCode = responseData?.code

  if (errorCode) {
    const upper = errorCode.toUpperCase().replace(/\s+/g, '_')
    if (['UNAUTHORIZED', 'NOT_FOUND', 'INTERNAL_SERVER_ERROR'].includes(upper)) {
      return upper as ErrorType
    }
  }

  switch (error.response.status) {
    case 401:
    case 403:
      return 'UNAUTHORIZED'
    case 404:
      return 'NOT_FOUND'
    case 500:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'UNKNOWN'
  }
}
