import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { AlertTriangle } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { CostBreakdown } from "@/components/cost-breakdown"
import { EmptyState } from "@/components/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getJobById } from "@/services/jobs"
import { getWorkById } from "@/services/portfolio"
import { createProject } from "@/services/projects"

type FieldErrors = Partial<Record<"title" | "scope" | "budget" | "deadline", string>>

interface SourceContext {
  freelancerId: string
  freelancerName: string
  label: string
  portfolioItemId?: string
  jobId?: string
}

/**
 * STORY-014 (with STORY-004 / STORY-012 as entry points).
 *
 * Reachable only as /start-project/work/:id or /start-project/job/:id — there
 * is no free-floating creation, which is FR-020 AC-1 and also why the database
 * requires exactly one source id.
 */
const StartProject = () => {
  const { from, id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [source, setSource] = useState<SourceContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [scope, setScope] = useState("")
  const [budget, setBudget] = useState("")
  const [deadline, setDeadline] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // STORY-014 AC-1: the linked source is resolved automatically, never typed.
  useEffect(() => {
    if (!id) return
    let active = true

    const load =
      from === "job"
        ? getJobById(id).then(({ job, client }) => {
            // On a job the freelancer is whoever responds — that is the
            // signed-in user. The client is the job's poster.
            void client
            return {
              freelancerId: searchParams.get("freelancer") ?? "",
              freelancerName: "",
              label: job.title,
              jobId: job.id,
            }
          })
        : getWorkById(id).then(({ card, author }) => ({
            freelancerId: card.freelanceId,
            freelancerName: author?.name ?? "this freelancer",
            label: card.title,
            portfolioItemId: card.id,
          }))

    load
      .then((context) => {
        if (!active) return
        setSource(context)
        setTitle((current) => current || context.label)
      })
      .catch((caught: unknown) => {
        if (active) {
          setLoadError(
            caught instanceof Error ? caught.message : "Could not load that."
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [from, id, searchParams])

  function validate(amount: number): FieldErrors {
    const errors: FieldErrors = {}
    if (!title.trim()) errors.title = "Give the project a title."
    if (!scope.trim()) errors.scope = "Describe what you need done."
    if (!budget.trim() || Number.isNaN(amount)) {
      errors.budget = "Enter a budget."
    } else if (amount < 0) {
      errors.budget = "Budget cannot be negative."
    }
    // FR-020 AC-3: a deadline, if given, must be in the future.
    if (deadline && new Date(deadline) <= new Date()) {
      errors.deadline = "Pick a date in the future."
    }
    return errors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !source || isSubmitting) return

    const amount = Number(budget)
    const errors = validate(amount)
    setFieldErrors(errors)
    // AC-3: field-level feedback, nothing already typed is discarded.
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    setFormError(null)

    try {
      const project = await createProject(user.userId, {
        freelancerId: source.freelancerId,
        title,
        scope,
        budget: amount,
        deadline: deadline || undefined,
        sourcePortfolioItemId: source.portfolioItemId,
        sourceJobId: source.jobId,
      })
      // AC-4: straight to the project's detail page.
      navigate(`/projects/${project.id}`, { replace: true })
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "Could not start this project."
      )
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (loadError || !source || !source.freelancerId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Could not start a project here"
          description={
            loadError ??
            "The work or job this project would be linked to is unavailable."
          }
          action={
            <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Back to browsing
            </Link>
          }
        />
      </div>
    )
  }

  const amount = Number(budget) || 0

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Start a project
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        With <span className="font-medium text-foreground">{source.freelancerName || "this freelancer"}</span>
        , from{" "}
        <Link
          to={source.jobId ? "/find-work" : `/work/${source.portfolioItemId}`}
          className="font-medium text-primary hover:underline dark:text-rose-400"
        >
          {source.label}
        </Link>
        . Everything stays on the platform.
      </p>

      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="project-title">Title</FieldLabel>
            <Input
              id="project-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(fieldErrors.title)}
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="project-scope">Scope</FieldLabel>
            <Textarea
              id="project-scope"
              rows={6}
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              placeholder="What needs doing, what already exists, and what a finished result looks like. There is no chat in this version, so this is the brief."
              aria-invalid={Boolean(fieldErrors.scope)}
            />
            {fieldErrors.scope && (
              <p className="text-sm text-destructive">{fieldErrors.scope}</p>
            )}
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="project-budget">Budget (USD)</FieldLabel>
              <Input
                id="project-budget"
                type="number"
                min={0}
                step="1"
                inputMode="decimal"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="4000"
                aria-invalid={Boolean(fieldErrors.budget)}
              />
              {fieldErrors.budget && (
                <p className="text-sm text-destructive">{fieldErrors.budget}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="project-deadline">
                Deadline (optional)
              </FieldLabel>
              <Input
                id="project-deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                aria-invalid={Boolean(fieldErrors.deadline)}
              />
              {fieldErrors.deadline && (
                <p className="text-sm text-destructive">
                  {fieldErrors.deadline}
                </p>
              )}
            </Field>
          </div>

          {/* AC-2: updates live as the budget is typed. */}
          <CostBreakdown budget={amount} title="Before you send this" />

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* AC-5: no double submission while a request is in flight. */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Sending…
                </>
              ) : (
                "Send enquiry"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

export default StartProject
