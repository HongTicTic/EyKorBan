import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { AlertTriangle, ImagePlus, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { useOutbox } from "@/components/outbox-provider"
import { EmptyState } from "@/components/empty-state"
import { SingleDropdown, DEFAULT_INDUSTRY_OPTIONS } from "@/components/dropdown"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES } from "@/interface/category"
import { cn } from "@/lib/utils"
import {
  createWork,
  getWorkById,
  updateWork,
  uploadWorkImage,
  type WorkInput,
} from "@/services/portfolio"

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
  label: c.name,
  value: c.id,
}))

const INDUSTRY_OPTIONS = DEFAULT_INDUSTRY_OPTIONS.filter(
  (option) => option.value !== "all"
)

type FieldErrors = Partial<Record<"title" | "categoryId" | "cover", string>>

/**
 * FR-008 / FR-009 / FR-010 / FR-011: one form for create and edit, saving as
 * either a draft or a published item. Ownership on edit is enforced by RLS —
 * loading someone else's id simply returns nothing.
 */
const WorkEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enqueue, isOnline } = useOutbox()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [industryId, setIndustryId] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")

  const [isLoading, setIsLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return

    let active = true

    getWorkById(id)
      .then(({ card }) => {
        if (!active) return
        setTitle(card.title)
        setSubtitle(card.subtitle)
        setCategoryId(card.categoryId)
        setIndustryId(card.industryId ?? "")
        setCoverImageUrl(card.coverImageUrl)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setLoadError(
          caught instanceof Error ? caught.message : "Could not load this work."
        )
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!title.trim()) errors.title = "Give the project a title."
    if (!categoryId) errors.categoryId = "Pick a category."
    if (!coverImageUrl) errors.cover = "Add a cover image."
    return errors
  }

  async function handleUpload(file: File) {
    if (!user) return
    setIsUploading(true)
    setFieldErrors((prev) => ({ ...prev, cover: undefined }))

    try {
      setCoverImageUrl(await uploadWorkImage(user.userId, file))
    } catch (caught) {
      setFieldErrors((prev) => ({
        ...prev,
        cover: caught instanceof Error ? caught.message : "That upload failed.",
      }))
    } finally {
      setIsUploading(false)
    }
  }

  async function save(status: "draft" | "published") {
    if (!user || isSaving) return

    const errors = validate()
    setFieldErrors(errors)
    // FR-008: invalid input gives field-level feedback without discarding
    // whatever the user already typed.
    if (Object.keys(errors).length > 0) return

    setIsSaving(true)
    setFormError(null)

    const input: WorkInput = {
      title,
      subtitle,
      description,
      coverImageUrl,
      categoryId,
      industryId,
      status,
    }

    // Offline: park the write in the outbox rather than losing the user's
    // work. It replays automatically on reconnect (lesson 7.3).
    if (!isOnline) {
      enqueue(
        id ? "updateWork" : "createWork",
        id ? { id, input } : { userId: user.userId, input },
        input.title
      )
      navigate("/my-work", { state: { queued: input.title } })
      return
    }

    try {
      if (id) {
        await updateWork(id, input)
      } else {
        await createWork(user.userId, input)
      }
      navigate("/my-work")
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "Could not save this work."
      )
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Could not load this work"
          description={loadError}
          action={
            <Link
              to="/my-work"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to my work
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {isEdit ? "Edit work" : "New work"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Images only in this version. Publishing is immediate — there is no
        approval step.
      </p>

      <form
        className="mt-8"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          save("published")
        }}
      >
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="work-title">Title</FieldLabel>
            <Input
              id="work-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Aether Data Platform v2.0"
              aria-invalid={Boolean(fieldErrors.title)}
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="work-subtitle">Subtitle</FieldLabel>
            <Input
              id="work-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Enterprise Web Platform"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="work-description">Description</FieldLabel>
            <Textarea
              id="work-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What the project was, what you did, what changed as a result."
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <SingleDropdown
                placeholder="Pick a category"
                options={CATEGORY_OPTIONS}
                value={categoryId}
                onSelect={setCategoryId}
                className="w-full"
              />
              {fieldErrors.categoryId && (
                <p className="text-sm text-destructive">
                  {fieldErrors.categoryId}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Industry</FieldLabel>
              <SingleDropdown
                placeholder="Pick an industry"
                options={INDUSTRY_OPTIONS}
                value={industryId}
                onSelect={setIndustryId}
                className="w-full"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Cover image</FieldLabel>
            <div className="flex flex-col gap-3">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    width={800}
                    height={450}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                    No image yet
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handleUpload(file)
                  event.target.value = ""
                }}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <ImagePlus data-icon="inline-start" />
                      {coverImageUrl ? "Replace image" : "Upload image"}
                    </>
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, AVIF or GIF, up to 5 MB
                </span>
              </div>

              {fieldErrors.cover && (
                <p className="text-sm text-destructive">{fieldErrors.cover}</p>
              )}
            </div>
          </Field>

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : (
                "Publish"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving || isUploading}
              onClick={() => save("draft")}
            >
              Save as draft
            </Button>
            <Link
              to="/my-work"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Cancel
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

export default WorkEditor
