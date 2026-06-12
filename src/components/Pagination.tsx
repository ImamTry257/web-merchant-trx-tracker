import type { PaginationMeta } from '../types/transaction'

interface PaginationProps {
  meta: PaginationMeta
  page: number
  onPageChange: (page: number) => void
}

export default function Pagination({ meta, page, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="text-sm text-gray-600">
        Page {meta.page} of {meta.totalPages}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!meta.previousPage}
          onClick={() => onPageChange(page - 1)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            meta.previousPage
              ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!meta.nextPage}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            meta.nextPage
              ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
