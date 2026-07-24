export default function AIChatBanner({ onDisable }) {
  return (
    <button
      onClick={onDisable}
      className="w-full bg-blue-50 px-4 py-2 text-center text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
    >
      ✨ AI is responding on your behalf — tap to disable
    </button>
  )
}
