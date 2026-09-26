import { useMemo, useState } from "react"
import { AlertTriangle, UserX } from "lucide-react"

import { DEFAULT_CATEGORY_OPTIONS, SingleDropdown } from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { FreelancerCard } from "@/components/freelancer-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import { listPublicFreelancers } from "@/services/profiles"

const SORT_OPTIONS = [
  { label: "Most liked", value: "likes" },
  { label: "Rate: low to high", value: "rate-asc" },
  { label: "Rate: high to low", value: "rate-desc" },
]

const HireCreatives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("likes")

  const { data, error, isLoading, refetch } = useAsyncData(
    () => listPublicFreelancers(selectedCategory),
    [selectedCategory]
  )

  // Sorting stays client-side: "most liked" and "rate" are derived from each
  // creative's works, which Postgres cannot order on in the same round trip.
  const visibleCreatives = useMemo(() => {
    const list = [...(data ?? [])]
    const rate = (creative: (typeof list)[number]) =>
      creative.profile?.hourlyRate ?? 0

    if (selectedSort === "rate-asc") {
      list.sort((a, b) => rate(a) - rate(b))
    } else if (selectedSort === "rate-desc") {
      list.sort((a, b) => rate(b) - rate(a))
    } else {
      list.sort((a, b) => b.totalLikes - a.totalLikes)
    }

    return list
  }, [data, selectedSort])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hire Creatives
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find freelancers by their work and start a project on the platform
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SingleDropdown
            placeholder="All categories"
            options={DEFAULT_CATEGORY_OPTIONS}
            value={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <SingleDropdown
            placeholder="Most liked"
            align="end"
            options={SORT_OPTIONS}
            value={selectedSort}
            onSelect={setSelectedSort}
          />
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {isLoading ? (
            <>
              <Spinner className="size-3" />
              Loading creatives…
            </>
          ) : (
            <>
              Showing {visibleCreatives.length}{" "}
              {visibleCreatives.length === 1 ? "creative" : "creatives"}
            </>
          )}
        </p>
      </div>

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load creatives"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-xl bg-muted"
              aria-hidden
            />
          ))}
        </div>
      ) : visibleCreatives.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCreatives.map((creative) =>
            creative.profile ? (
              <FreelancerCard
                key={creative.user.userId}
                user={creative.user}
                profile={creative.profile}
                works={creative.works}
              />
            ) : null
          )}
        </div>
      ) : (
        <EmptyState
          icon={UserX}
          title="No creatives in this category yet"
          description="Try another category or browse everyone."
          action={
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("all")}
            >
              Show all creatives
            </Button>
          }
        />
      )}
    </div>
  )
}

export default HireCreatives
