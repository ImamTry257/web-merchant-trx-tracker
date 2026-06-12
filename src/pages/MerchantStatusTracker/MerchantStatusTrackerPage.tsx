import { useTransactions } from '../../hooks/useTransactions'
import {
  TransactionFilter,
  TransactionTable,
  Pagination,
  LoadingState,
  EmptyState,
  ErrorState,
} from '../../components'

export default function MerchantStatusTrackerPage() {
  const {
    transactions,
    meta,
    loading,
    error,
    filter,
    page,
    setFilter,
    setPage,
    resetFilter,
  } = useTransactions()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">Merchant Status Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Filter Section */}
        <TransactionFilter
          filter={filter}
          onFilter={setFilter}
          onReset={resetFilter}
        />

        {/* Result Section */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {loading && transactions.length === 0 ? (
            <LoadingState />
          ) : error && transactions.length === 0 ? (
            <div className="p-6">
              <ErrorState error={error} />
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <TransactionTable transactions={transactions} />
              {meta && (
                <Pagination
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          {/* Overlay loading indicator for polling refresh */}
          {loading && transactions.length > 0 && (
            <div className="flex items-center justify-center py-2 bg-blue-50 border-t border-blue-100">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-blue-600 font-medium">Refreshing...</span>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
