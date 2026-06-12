import type { ErrorType } from '../types/transaction'

interface ErrorStateProps {
  error: ErrorType
}

const ERROR_MESSAGES: Record<ErrorType, { title: string; description: string }> = {
  UNAUTHORIZED: {
    title: 'Unauthorized Access',
    description: 'Please check your credentials and try again.',
  },
  NOT_FOUND: {
    title: 'Transaction Not Found',
    description: 'No transaction matching your criteria was found.',
  },
  INTERNAL_SERVER_ERROR: {
    title: 'Internal Server Error',
    description: 'Something went wrong on our end. Please try again later.',
  },
  UNKNOWN: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
}

const ERROR_STYLES: Record<ErrorType, string> = {
  UNAUTHORIZED: 'border-red-300 bg-red-50 text-red-700',
  NOT_FOUND: 'border-blue-300 bg-blue-50 text-blue-700',
  INTERNAL_SERVER_ERROR: 'border-red-300 bg-red-50 text-red-700',
  UNKNOWN: 'border-gray-300 bg-gray-50 text-gray-700',
}

export default function ErrorState({ error }: ErrorStateProps) {
  const message = ERROR_MESSAGES[error]
  const style = ERROR_STYLES[error]

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 border rounded-lg ${style}`}>
      <svg
        className="w-12 h-12 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h3 className="text-lg font-semibold">{message.title}</h3>
      <p className="mt-1 text-sm opacity-80">{message.description}</p>
    </div>
  )
}
