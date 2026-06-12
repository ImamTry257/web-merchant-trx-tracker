import dayjs from 'dayjs'
import type { Transaction } from '../types/transaction'
import StatusBadge from './StatusBadge'

interface TransactionTableProps {
  transactions: Transaction[]
}

function formatAmount(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`
}

function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('DD/MM/YYYY HH:mm')
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <>
      {/* Desktop Table — hidden on small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Merchant ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Partner Ref No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ref No
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Transaction Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Paid Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((trx, idx) => (
              <tr
                key={`${trx.referenceNumber}-${idx}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {trx.merchantId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {trx.partnerReferenceNo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap font-mono">
                  {trx.referenceNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-right font-mono">
                  {formatAmount(trx.amount)}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                  <StatusBadge status={trx.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {formatDate(trx.transactionDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {trx.paidDate ? formatDate(trx.paidDate) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List — shown on small screens */}
      <div className="md:hidden divide-y divide-gray-200">
        {transactions.map((trx, idx) => (
          <div
            key={`${trx.referenceNumber}-${idx}`}
            className="p-4 space-y-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{trx.merchantId}</span>
              <StatusBadge status={trx.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Partner Ref:</span>
                <p className="text-gray-700">{trx.partnerReferenceNo}</p>
              </div>
              <div>
                <span className="text-gray-500">Ref No:</span>
                <p className="text-gray-700 font-mono">{trx.referenceNumber}</p>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <p className="text-gray-900 font-mono font-medium">{formatAmount(trx.amount)}</p>
              </div>
              <div>
                <span className="text-gray-500">Transaction Date:</span>
                <p className="text-gray-700">{formatDate(trx.transactionDate)}</p>
              </div>
              <div>
                <span className="text-gray-500">Paid Date:</span>
                <p className="text-gray-700">{trx.paidDate ? formatDate(trx.paidDate) : '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
