export default function RequestBadge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
