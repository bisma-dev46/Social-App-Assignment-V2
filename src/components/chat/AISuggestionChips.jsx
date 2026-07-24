export default function AISuggestionChips({ suggestions, onPick }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="ml-10 mt-1 flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onPick(s)}
          className="cursor-pointer rounded-full border border-blue-200 bg-white px-3 py-1 text-sm text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-300"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
