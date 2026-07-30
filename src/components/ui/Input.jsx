import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(function Input(
  { label, error, type = 'text', className, ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all',
          'bg-white dark:bg-gray-800 dark:text-gray-100',
          error
            ? 'border-accent-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200'
            : 'border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:focus:ring-brand-900',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-accent-600 dark:text-accent-400">{error.message}</p>}
    </div>
  )
})

export default Input