import type { TransactionStatus } from '../types/transaction'

interface StatusBadgeProps {
  status: TransactionStatus
}

const BADGE_STYLES: Record<TransactionStatus, string> = {
  SUCCESS: 'bg-green-100 text-green-800 border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  EXPIRED: 'bg-red-100 text-red-800 border-red-200',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${BADGE_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
