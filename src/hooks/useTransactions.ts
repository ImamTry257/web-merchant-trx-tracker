import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  Transaction,
  TransactionFilter,
  PaginationMeta,
  ErrorType,
} from '../types/transaction'
import { fetchTransactions, mapAxiosError } from '../services/transaction.service'

interface UseTransactionsReturn {
  transactions: Transaction[]
  meta: PaginationMeta | null
  loading: boolean
  error: ErrorType | null
  filter: TransactionFilter
  page: number
  setFilter: (filter: TransactionFilter) => void
  setPage: (page: number) => void
  resetFilter: () => void
  refresh: () => void
}

const POLL_INTERVAL = 5000

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorType | null>(null)
  const [filter, setFilter] = useState<TransactionFilter>({})
  const [page, setPage] = useState<number>(1)

  // Refs to hold latest values for polling callback
  const filterRef = useRef(filter)
  const pageRef = useRef(page)

  filterRef.current = filter
  pageRef.current = page

  const load = useCallback(async (currentFilter: TransactionFilter, currentPage: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchTransactions(currentFilter, currentPage)
      setTransactions(response.data)
      setMeta(response.meta)
    } catch (err) {
      const errorType = mapAxiosError(err as import('axios').AxiosError)
      setError(errorType)
      if (errorType !== 'UNKNOWN') {
        setTransactions([])
        setMeta(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    load(filterRef.current, pageRef.current)
  }, [load])

  // Initial fetch on mount + auto-refresh polling every 5 seconds
  useEffect(() => {
    load(filterRef.current, pageRef.current)

    const intervalId = setInterval(() => {
      load(filterRef.current, pageRef.current)
    }, POLL_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [load])

  const handleSetFilter = useCallback((newFilter: TransactionFilter) => {
    setFilter(newFilter)
    setPage(1)
    load(newFilter, 1)
  }, [load])

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage)
    load(filterRef.current, newPage)
  }, [load])

  const handleResetFilter = useCallback(() => {
    setFilter({})
    setPage(1)
    load({}, 1)
  }, [load])

  return {
    transactions,
    meta,
    loading,
    error,
    filter,
    page,
    setFilter: handleSetFilter,
    setPage: handleSetPage,
    resetFilter: handleResetFilter,
    refresh,
  }
}
