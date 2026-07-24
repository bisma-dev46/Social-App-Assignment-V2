import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { fileToBase64 } from '../../utils/helpers'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import AIProfileOptimize from '../../components/ai/AIProfileOptimize'

const MAX_BIO = 150

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar)
  const [successMessage, setSuccessMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  })

  const bio = watch('bio') || ''
  const nameValue = watch('name') || ''
  const locationValue = watch('location') || ''

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setAvatarPreview(base64)
  }

  function onSubmit(data) {
    setSaving(true)
    updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
    })
    setSaving(false)
    setSuccessMessage('Profile updated successfully')
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>

      {successMessage && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
          {successMessage}
        </p>
      )}

      <div className="mb-4 flex items-center gap-3">
        <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          error={errors.name}
          {...register('name', { required: 'Full name is required' })}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Bio</label>
          <textarea
            rows={3}
            maxLength={MAX_BIO}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            {...register('bio', { maxLength: MAX_BIO })}
          />
          <p className="mt-1 text-right text-xs text-gray-400">{bio.length} / {MAX_BIO}</p>
          <div className="mt-2">
            <AIProfileOptimize
              name={nameValue}
              bio={bio}
              location={locationValue}
              onUseSuggestion={(s) => setValue('bio', s, { shouldValidate: true, shouldDirty: true })}
            />
          </div>
        </div>

        <Input label="Location" {...register('location')} />

        <Button type="submit" isLoading={saving}>Save Changes</Button>
      </form>
    </div>
  )
}
