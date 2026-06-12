import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  TransactionFilter,
  TransactionResponse,
  ErrorType,
  ApiResponseEnvelope,
} from '../types/transaction'
import { generateTimestamp } from '../utils/timestamp'
import { generateSignature, sha256Hex } from '../utils/signature'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const MERCHANT_TOKEN = import.meta.env.VITE_MERCHANT_TOKEN ?? 'merchant-demo-token'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY ?? 'demo-secret-key'

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
  const pathOnly = '/api/v1/merchant/transactions'
  const timestamp = generateTimestamp()
  const bodyHash = await sha256Hex('')
  const signature = await generateSignature('GET', pathOnly, timestamp, SECRET_KEY, bodyHash)

  const requestUrl = `${API_BASE_URL}${pathWithQuery}`
  const requestHeaders = {
    Authorization: `Bearer ${MERCHANT_TOKEN}`,
    'X-TIMESTAMP': timestamp,
    'X-SIGNATURE': signature,
  }

  console.log('========================================')
  console.log('🚀 TRANSACTION LIST REQUEST')
  console.log('========================================')
  console.log('URL         :', requestUrl)
  console.log('Path (sign) :', pathOnly)
  console.log('Timestamp   :', timestamp)
  console.log('BodyHash    :', bodyHash)
  console.log('StringToSign:', `GET:${pathOnly}:${timestamp}:${bodyHash}`)
  console.log('Signature   :', signature)
  console.log('Filter      :', JSON.stringify(filter, null, 2))
  console.log('Page        :', page)

  const response = await apiClient.get<ApiResponseEnvelope>(pathWithQuery, {
    headers: requestHeaders,
  })

  console.log('========================================')
  console.log('✅ TRANSACTION LIST RESPONSE')
  console.log('========================================')
  console.log('Status  :', response.status)
  console.log('Data    :', JSON.stringify(response.data, null, 2))

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
    if (['UNAUTHORIZED', 'INVALID_SIGNATURE', 'INVALID_TIMESTAMP', 'NOT_FOUND', 'INTERNAL_SERVER_ERROR'].includes(upper)) {
      return upper as ErrorType
    }
  }

  switch (error.response.status) {
    case 400:
      return 'INVALID_TIMESTAMP'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'INVALID_SIGNATURE'
    case 404:
      return 'NOT_FOUND'
    case 500:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'UNKNOWN'
  }
}
