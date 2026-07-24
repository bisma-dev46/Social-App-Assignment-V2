import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Already logged in? Skip straight to the dashboard.
  if (isAuthenticated) return <Navigate to="/dashboard/posts" replace />

  const infoMessage = location.state?.message

  async function onSubmit(data) {
    setFormError('')
    setSubmitting(true)
    try {
      login(data.email, data.password)
      navigate('/dashboard/posts')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Log in</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Welcome back to SocialApp</p>

      {infoMessage && (
        <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-gray-800 dark:text-brand-500">
          {infoMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />
        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <Button type="submit" className="w-full" isLoading={submitting}>
          Log in
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-500 hover:underline">Sign up</Link>
      </p>
    </div>
  )
}
