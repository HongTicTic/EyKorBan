import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { AlertTriangle } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { useOutbox } from "@/components/outbox-provider"
import { DEFAULT_INDUSTRY_OPTIONS, SingleDropdown } from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES } from "@/interface/category"
import { cn } from "@/lib/utils"
import { createJob, getJobById, updateJob } from "@/services/jobs"

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
  label: c.name,
  value: c.id,
}))

const INDUSTRY_OPTIONS = DEFAULT_INDUSTRY_OPTIONS.filter(
  (option) => option.value !== "all"
)

type FieldErrors = Partial<
  Record<"title" | "description" | "categoryId" | "industryId", string>
>

/** FR-016 / FR-018: post a job, or edit one you already posted. */
const JobEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enqueue, isOnline } = useOutbox()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [industryId, setIndustryId] = useState("")

  const [isLoading, setIsLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!id) return

    let active = true

    getJobById(id)
      .then(({ job }) => {
        if (!active) return
        setTitle(job.title)
        setDescription(job.description)
        setCategoryId(job.categoryId)
        setIndustryId(job.industryId)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setLoadError(
          caught instanceof Error ? caught.message : "Could not load this job."
        )
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || isSaving) return

    const errors: FieldErrors = {}
    if (!title.trim()) errors.title = "Give the job a title."
    if (!description.trim()) errors.description = "Describe what you need."
    if (!categoryId) errors.categoryId = "Pick a category."
    if (!industryId) errors.industryId = "Pick an industry."

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSaving(true)
    setFormError(null)

    // Offline: queue it and replay on reconnect (lesson 7.3).
    if (!isOnline) {
      enqueue(
        id ? "updateJob" : "createJob",
        id
          ? { id, input: { title, description, categoryId, industryId } }
          : {
              userId: user.userId,
              input: { title, description, categoryId, industryId },
            },
        title
      )
      navigate("/my-jobs", { state: { queued: title } })
      return
    }

    try {
      if (id) {
        await updateJob(id, { title, description, categoryId, industryId })
      } else {
        await createJob(user.userId, {
          title,
          description,
          categoryId,
          industryId,
        })
      }
      navigate("/my-jobs")
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "Could not save this job."
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
          title="Could not load this job"
          description={loadError}
          action={
            <Link
              to="/my-jobs"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to my jobs
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {isEdit ? "Edit job" : "Post a job"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your job goes live immediately — there is no approval step. You can
        close it at any time.
      </p>

      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="job-title">Title</FieldLabel>
            <Input
              id="job-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Landing page for a fintech savings app"
              aria-invalid={Boolean(fieldErrors.title)}
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="job-description">Description</FieldLabel>
            <Textarea
              id="job-description"
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What you need, what is already done, and what a good result looks like."
              aria-invalid={Boolean(fieldErrors.description)}
            />
            {fieldErrors.description && (
              <p className="text-sm text-destructive">
                {fieldErrors.description}
              </p>
            )}
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
              {fieldErrors.industryId && (
                <p className="text-sm text-destructive">
                  {fieldErrors.industryId}
                </p>
              )}
            </Field>
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Post job"
              )}
            </Button>
            <Link
              to="/my-jobs"
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

export default JobEditor
