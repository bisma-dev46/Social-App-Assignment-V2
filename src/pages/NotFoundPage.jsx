import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">This page doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>Back to Feed</Button>
      </Link>
    </div>
  )
}
