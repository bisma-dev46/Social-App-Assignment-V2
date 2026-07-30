import clsx from 'clsx'

const VARIANTS = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-gray-800 dark:text-brand-300 dark:hover:bg-gray-700',
  danger: 'bg-accent-500 hover:bg-accent-600 text-white shadow-glow-accent',
  ghost: 'bg-transparent hover:bg-brand-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200',
}

const SIZES = {
  sm: 'text-sm px-3.5 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className,
  ...rest
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold font-display transition-all duration-150',
        'hover:-translate-y-0.5 active:translate-y-0',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}