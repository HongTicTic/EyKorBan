import { useState } from "react"
import { AlertTriangle, SearchX, X } from "lucide-react"

import {
  DEFAULT_CATEGORY_OPTIONS,
  DEFAULT_INDUSTRY_OPTIONS,
  SingleDropdown,
} from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import { listOpenJobs } from "@/services/jobs"

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary/10 py-1 pr-2 pl-3 text-xs font-medium text-primary transition-colors hover:bg-primary/15 dark:text-rose-400"
    >
      {label}
      <X className="size-3.5" />
    </button>
  )
}

const FindWork = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  // Both filters are applied by Postgres; the query re-runs when either changes.
  const { data, error, isLoading, refetch } = useAsyncData(
    () =>
      listOpenJobs({
        categoryId: selectedCategory,
        industryId: selectedIndustry,
      }),
    [selectedCategory, selectedIndustry]
  )

  const visibleJobs = data ?? []

  const categoryLabel = DEFAULT_CATEGORY_OPTIONS.find(
    (option) => option.value === selectedCategory
  )?.label
  const industryLabel = DEFAULT_INDUSTRY_OPTIONS.find(
    (option) => option.value === selectedIndustry
  )?.label
  const hasFilters = selectedCategory !== "all" || selectedIndustry !== "all"

  const resetFilters = () => {
    setSelectedCategory("all")
    setSelectedIndustry("all")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Find Work
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Open jobs posted by clients, newest first
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <SingleDropdown
            placeholder="All categories"
            options={DEFAULT_CATEGORY_OPTIONS}
            value={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <SingleDropdown
            placeholder="All industries"
            options={DEFAULT_INDUSTRY_OPTIONS}
            value={selectedIndustry}
            onSelect={setSelectedIndustry}
          />
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory !== "all" && categoryLabel && (
              <FilterChip
                label={categoryLabel}
                onRemove={() => setSelectedCategory("all")}
              />
            )}
            {selectedIndustry !== "all" && industryLabel && (
              <FilterChip
                label={industryLabel}
                onRemove={() => setSelectedIndustry("all")}
              />
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Reset all
            </button>
          </div>
        )}

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {isLoading ? (
            <>
              <Spinner className="size-3" />
              Loading open jobs…
            </>
          ) : (
            <>
              {visibleJobs.length} open{" "}
              {visibleJobs.length === 1 ? "job" : "jobs"}
            </>
          )}
        </p>
      </div>

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load jobs"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-muted"
              aria-hidden
            />
          ))}
        </div>
      ) : visibleJobs.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visibleJobs.map(({ job }) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No open jobs match your filters"
          description="Try a different category or industry."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Reset all filters
            </Button>
          }
        />
      )}
    </div>
  )
}

export default FindWork
