import { useState, useCallback } from 'react'
import { storage, generateId } from '../utils/storage'

// Centralizes every read/write to the 'posts', 'comments' and 'likes' keys.
// Pages call these functions instead of touching storage.js directly, so the
// CRUD logic only lives in one place.
export function usePosts() {
  const [posts, setPostsState] = useState(() => storage.getPosts())
  const [comments, setCommentsState] = useState(() => storage.getComments())
  const [likes, setLikesState] = useState(() => storage.getLikes())

  const refresh = useCallback(() => {
    setPostsState(storage.getPosts())
    setCommentsState(storage.getComments())
    setLikesState(storage.getLikes())
  }, [])

  // ---------- posts ----------
  const createPost = useCallback((data, authorId) => {
    const now = new Date().toISOString()
    const newPost = {
      id: generateId('post'),
      authorId,
      description: data.description,
      image: data.image || null,
      isPublic: !!data.isPublic,
      isDraft: !!data.isDraft,
      createdAt: now,
      updatedAt: now,
    }
    const next = [...storage.getPosts(), newPost]
    storage.setPosts(next)
    setPostsState(next)
    return newPost
  }, [])

  const updatePost = useCallback((postId, data) => {
    const next = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    )
    storage.setPosts(next)
    setPostsState(next)
  }, [])

  const deletePost = useCallback((postId) => {
    const next = storage.getPosts().filter((p) => p.id !== postId)
    storage.setPosts(next)
    setPostsState(next)
    // Cascade: also clean up that post's comments and likes
    const nextComments = storage.getComments().filter((c) => c.postId !== postId)
    storage.setComments(nextComments)
    setCommentsState(nextComments)
    const nextLikes = storage.getLikes().filter((l) => l.postId !== postId)
    storage.setLikes(nextLikes)
    setLikesState(nextLikes)
  }, [])

  const togglePublic = useCallback((postId) => {
    const next = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, isPublic: !p.isPublic } : p
    )
    storage.setPosts(next)
    setPostsState(next)
  }, [])

  const publishPost = useCallback((postId) => {
    const next = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, isDraft: false, isPublic: true } : p
    )
    storage.setPosts(next)
    setPostsState(next)
  }, [])

  const getPostById = useCallback((postId) => {
    return storage.getPosts().find((p) => p.id === postId) || null
  }, [])

  // ---------- comments ----------
  const getCommentsForPost = useCallback(
    (postId) => comments.filter((c) => c.postId === postId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [comments]
  )

  const addComment = useCallback((postId, authorId, text) => {
    const newComment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    }
    const next = [...storage.getComments(), newComment]
    storage.setComments(next)
    setCommentsState(next)
    return newComment
  }, [])

  const deleteComment = useCallback((commentId) => {
    const next = storage.getComments().filter((c) => c.id !== commentId)
    storage.setComments(next)
    setCommentsState(next)
  }, [])

  // ---------- likes ----------
  const getLikesForPost = useCallback(
    (postId) => likes.filter((l) => l.postId === postId),
    [likes]
  )

  const hasUserLiked = useCallback(
    (postId, userId) => likes.some((l) => l.postId === postId && l.userId === userId),
    [likes]
  )

  const toggleLike = useCallback((postId, userId) => {
    const current = storage.getLikes()
    const existing = current.find((l) => l.postId === postId && l.userId === userId)
    let next
    if (existing) {
      next = current.filter((l) => l.id !== existing.id) // unlike
    } else {
      next = [...current, { id: generateId('like'), postId, userId, createdAt: new Date().toISOString() }]
    }
    storage.setLikes(next)
    setLikesState(next)
  }, [])

  return {
    posts,
    comments,
    likes,
    refresh,
    createPost,
    updatePost,
    deletePost,
    togglePublic,
    publishPost,
    getPostById,
    getCommentsForPost,
    addComment,
    deleteComment,
    getLikesForPost,
    hasUserLiked,
    toggleLike,
  }
}
