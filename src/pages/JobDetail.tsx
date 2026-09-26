import { Link, useParams } from "react-router"
import { ArrowRight, Briefcase, Calendar, Pencil } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { DEFAULT_INDUSTRY_OPTIONS } from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { ShareButton } from "@/components/share-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import { getCategoryName } from "@/interface/category"
import { RoleName } from "@/interface/user"
import { formatDate, getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import { getJobById } from "@/services/jobs"

/**
 * The job detail page — listed in the spec's Job Screens and previously
 * missing, so every job card led nowhere.
 *
 * NFR-003 / STORY-012 AC-6: the client is named, never contactable. Their
 * email is not in this page and not in its network payload — the database no
 * longer grants it to API roles, so it cannot be fetched even by accident.
 */
const JobDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()

  const { data, error, isLoading, refetch } = useAsyncData(
    () => (id ? getJobById(id) : Promise.reject(new Error("Not found."))),
    [id]
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  // RLS returns a closed job only to its owner, so for everyone else a closed
  // or deleted job is simply absent — one not-found state covers both.
  if (error || !data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={Briefcase}
          title="This job is not available"
          description="It may have been filled, closed, or removed."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/find-work" className={cn(buttonVariants())}>
                Browse open jobs
              </Link>
              {error && error !== "Not found." && (
                <Button variant="outline" onClick={refetch}>
                  Try again
                </Button>
              )}
            </div>
          }
        />
      </div>
    )
  }

  const { job, client } = data
  const isOwner = user?.userId === job.clientId
  const isOpen = job.status === "open"
  const industry =
    DEFAULT_INDUSTRY_OPTIONS.find((option) => option.value === job.industryId)
      ?.label ?? job.industryId

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/find-work"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← All jobs
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{getCategoryName(job.categoryId)}</Badge>
        <Badge variant="outline">{industry}</Badge>
        {!isOpen && <Badge variant="outline">Closed</Badge>}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance">
        {job.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Avatar className="size-6">
            {client?.avatarUrl && <AvatarImage src={client.avatarUrl} alt="" />}
            <AvatarFallback className="text-[10px]">
              {getInitials(client?.name ?? "Client")}
            </AvatarFallback>
          </Avatar>
          Posted by{" "}
          <span className="font-medium text-foreground">
            {client?.name ?? "a client"}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" />
          {formatDate(job.publishedAt)}
        </span>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">About the work</h2>
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {job.description}
        </p>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isOwner ? (
          <Link to={`/jobs/${job.id}/edit`} className={cn(buttonVariants())}>
            <Pencil data-icon="inline-start" />
            Edit this job
          </Link>
        ) : user?.role === RoleName.CLIENT ? (
          <p className="text-sm text-muted-foreground">
            Only freelancers can respond to a job.
          </p>
        ) : isOpen ? (
          // STORY-012 AC-1: opens the start-project flow tied to this job.
          // AC-2: a signed-out visitor goes through sign-in and comes back.
          <Link
            to={`/start-project/job/${job.id}`}
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
          >
            Start a project
            <ArrowRight data-icon="inline-end" />
          </Link>
        ) : null}

        <ShareButton title={job.title} text={`Open job on EyKorBan: ${job.title}`} />
      </div>

      {!user && isOpen && (
        <p className="mt-3 text-xs text-muted-foreground">
          You will be asked to sign in, then brought straight back here.
        </p>
      )}
    </div>
  )
}

export default JobDetail
