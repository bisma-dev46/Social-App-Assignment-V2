import clsx from 'clsx'

const VARIANTS = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
  public: 'bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
  private: 'bg-sunny-300/30 text-sunny-500 dark:text-sunny-400',
}

export default function Badge({ variant = 'draft', children }) {
  return (
    <span className={clsx('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', VARIANTS[variant])}>
      {children}
    </span>
  )
}