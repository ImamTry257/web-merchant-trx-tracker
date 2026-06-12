import { useState } from 'react'
import type { TransactionFilter as TransactionFilterType, TransactionStatus } from '../types/transaction'

interface TransactionFilterProps {
  filter: TransactionFilterType
  onFilter: (filter: TransactionFilterType) => void
  onReset: () => void
}

const STATUS_OPTIONS: { value: TransactionStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'EXPIRED', label: 'EXPIRED' },
]

export default function TransactionFilter({ filter, onFilter, onReset }: TransactionFilterProps) {
  const [localFilter, setLocalFilter] = useState<TransactionFilterType>(filter)
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (key: keyof TransactionFilterType, value: string) => {
    setLocalFilter((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ ...localFilter, referenceNumber: searchTerm || undefined })
  }

  const handleReset = () => {
    setLocalFilter({})
    setSearchTerm('')
    onReset()
  }

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Merchant ID */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Merchant ID</label>
          <input
            type="text"
            placeholder="Enter Merchant ID"
            value={localFilter.merchantId ?? ''}
            onChange={(e) => handleChange('merchantId', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
          <select
            value={localFilter.status ?? ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Date Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={localFilter.startDate ?? ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={localFilter.endDate ?? ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search - full width on all screens */}
        <div className="md:col-span-2 lg:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Reference Number / Partner Reference Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
