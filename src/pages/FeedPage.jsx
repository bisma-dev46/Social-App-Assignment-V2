import { useState, useMemo } from 'react'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'

export default function FeedPage() {
  const { posts } = usePosts()
  const [query, setQuery] = useState('')

  const publicPosts = useMemo(
    () =>
      posts
        .filter((p) => p.isPublic && !p.isDraft)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  )

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return publicPosts
    const q = query.toLowerCase()
    return publicPosts.filter((p) => p.description.toLowerCase().includes(q))
  }, [publicPosts, query])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />

      {publicPosts.length === 0 && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No posts yet — be the first to share!
        </p>
      )}

      {publicPosts.length > 0 && filteredPosts.length === 0 && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No results found for "{query}"
        </p>
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
