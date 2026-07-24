import { useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import { fileToBase64 } from '../../utils/helpers'
import Button from '../ui/Button'
import AIPostAssistant from '../ai/AIPostAssistant'

const MAX_CHARS = 500

// `defaultValues` lets EditPost pre-fill this same form.
// `onSave(data, { isDraft })` is called on submit with the parsed form data.
export default function PostForm({ defaultValues, onSave, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: defaultValues?.description || '',
      isPublic: defaultValues?.isPublic ?? true,
    },
  })

  const [imagePreview, setImagePreview] = useState(defaultValues?.image || null)
  const description = watch('description') || ''
  const charCount = description.length

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setImagePreview(base64)
  }

  function clearImage() {
    setImagePreview(null)
  }

  function submitAs(isDraft) {
    return handleSubmit((data) => {
      onSave(
        {
          description: data.description,
          image: imagePreview,
          isPublic: isDraft ? !!data.isPublic : true,
          isDraft,
        },
        { isDraft }
      )
    })
  }

  const counterColor =
    charCount >= 480 ? 'text-red-500' : charCount >= 400 ? 'text-orange-500' : 'text-gray-400'

  return (
    <form className="space-y-4">
      <AIPostAssistant onUseContent={(text) => setValue('description', text, { shouldValidate: true, shouldDirty: true })} />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          rows={4}
          maxLength={MAX_CHARS}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 text-sm outline-none dark:bg-gray-800 dark:text-gray-100',
            errors.description ? 'border-red-400' : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
          )}
          placeholder="What's on your mind?"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
          })}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span className={clsx('text-xs', counterColor)}>
            {charCount} / {MAX_CHARS} characters
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Image (optional)
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {imagePreview && (
          <div className="relative mt-2 inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-xs text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublic" {...register('isPublic')} onChange={(e) => setValue('isPublic', e.target.checked)} defaultChecked={defaultValues?.isPublic ?? true} className="h-4 w-4" />
        <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-200">
          Make this post public
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" isLoading={submitting === 'draft'} onClick={submitAs(true)}>
          Save as Draft
        </Button>
        <Button type="button" variant="primary" isLoading={submitting === 'publish'} onClick={submitAs(false)} disabled={charCount >= MAX_CHARS}>
          Publish
        </Button>
      </div>
    </form>
  )
}
