import { useMemo, useState } from "react"
import { UserX } from "lucide-react"

import { DEFAULT_CATEGORY_OPTIONS, SingleDropdown } from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { FreelancerCard } from "@/components/freelancer-card"
import { Button } from "@/components/ui/button"
import { RoleName } from "@/interface/user"
import { useData } from "@/lib/use-data"

const SORT_OPTIONS = [
  { label: "Most liked", value: "likes" },
  { label: "Rate: low to high", value: "rate-asc" },
  { label: "Rate: high to low", value: "rate-desc" },
]

const HireCreatives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("likes")
  const { users, freelancerProfiles, projectCards } = useData()

  const creatives = useMemo(
    () =>
      users
        .filter((user) => user.role === RoleName.FREELANCER)
        .flatMap((user) => {
          const profile = freelancerProfiles.find(
            (candidate) => candidate.userId === user.userId
          )
          if (!profile?.publicProfileEnabled) return []

          const works = projectCards.filter(
            (card) => card.freelanceId === user.userId
          )
          const totalLikes = works.reduce((sum, work) => sum + work.likeCount, 0)
          return [{ user, profile, works, totalLikes }]
        }),
    [freelancerProfiles, projectCards, users]
  )

  const visibleCreatives = useMemo(() => {
    const list =
      selectedCategory === "all"
        ? [...creatives]
        : creatives.filter((creative) =>
            creative.works.some((work) => work.categoryId === selectedCategory)
          )

    const rate = (creative: (typeof creatives)[number]) =>
      creative.profile.hourlyRate ?? 0

    if (selectedSort === "rate-asc") {
      list.sort((a, b) => rate(a) - rate(b))
    } else if (selectedSort === "rate-desc") {
      list.sort((a, b) => rate(b) - rate(a))
    } else {
      list.sort((a, b) => b.totalLikes - a.totalLikes)
    }

    return list
  }, [creatives, selectedCategory, selectedSort])

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
        <p className="text-xs text-muted-foreground">
          Showing {visibleCreatives.length}{" "}
          {visibleCreatives.length === 1 ? "creative" : "creatives"}
        </p>
      </div>

      {visibleCreatives.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCreatives.map((creative) => (
            <FreelancerCard
              key={creative.user.userId}
              user={creative.user}
              profile={creative.profile}
              works={creative.works}
            />
          ))}
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
