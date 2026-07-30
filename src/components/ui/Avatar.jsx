import clsx from 'clsx'

const SIZES = { sm: 32, md: 48, lg: 80 }

const GRADIENTS = [
  'from-brand-400 to-accent-400',
  'from-accent-400 to-sunny-400',
  'from-sunny-400 to-brand-400',
  'from-brand-500 to-brand-300',
  'from-accent-500 to-brand-400',
]
function gradientForName(name = '') {
  const code = name.charCodeAt(0) || 0
  return GRADIENTS[code % GRADIENTS.length]
}

export default function Avatar({ src, name = '?', size = 'md', className }) {
  const px = SIZES[size] || SIZES.md
  const style = { width: px, height: px }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className={clsx('flex-shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-gray-900', className)}
      />
    )
  }

  return (
    <div
      style={style}
      className={clsx(
        'flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-bold text-white ring-2 ring-white dark:ring-gray-900',
        gradientForName(name),
        className
      )}
    >
      <span style={{ fontSize: px * 0.4 }}>{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </div>
  )
}