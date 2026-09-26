import { useState } from "react"
import { AlertTriangle, SearchX } from "lucide-react"

import Dropdown from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { HomeHero } from "@/components/home-hero"
import { useLanguage } from "@/components/language-provider"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import { listPublishedWork, type PortfolioSort } from "@/services/portfolio"

const SKELETON_COUNT = 8

const Home = () => {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedSort, setSelectedSort] = useState<PortfolioSort>("recent")

  // Filtering and ordering run in Postgres, so changing a filter is a query,
  // not a client-side re-sort of everything ever published.
  const { data, error, isLoading, refetch } = useAsyncData(
    () =>
      listPublishedWork({
        categoryId: selectedCategory,
        industryId: selectedIndustry,
        sort: selectedSort,
      }),
    [selectedCategory, selectedIndustry, selectedSort]
  )

  const projects = data ?? []

  return (
    <>
      <HomeHero />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("home.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("home.subtitle")}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <Dropdown
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedSort={selectedSort}
            onSortChange={(sort) => setSelectedSort(sort as PortfolioSort)}
          />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            {isLoading ? (
              <>
                <Spinner className="size-3" />
                {t("home.loading")}
              </>
            ) : (
              <>{t("home.showing", { count: projects.length })}</>
            )}
          </p>
        </div>

        {error ? (
          <EmptyState
            icon={AlertTriangle}
            title={t("home.errorTitle")}
            description={error}
            action={
              <Button variant="outline" onClick={refetch}>
                {t("home.retry")}
              </Button>
            }
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-xl bg-muted"
                aria-hidden
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t("home.emptyTitle")}
            description={t("home.emptyDescription")}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedIndustry("all")
                }}
              >
                {t("home.resetFilters")}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map(({ card, author }) => (
              <ProjectCard
                key={card.id}
                project={card}
                authorName={author?.name}
                authorAvatar={author?.avatarUrl}
                className="max-w-none"
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Home
