import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import Dropdown from "@/components/dropdown"
import { ProjectCard } from "@/components/project-card"
import { MOCK_PROJECT_CARDS, MOCK_USERS } from "@/mock-data/mock-data"

const Home = () => {
  const { theme, setTheme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedSort, setSelectedSort] = useState("recent")

  const userMap = useMemo(
    () => new Map(MOCK_USERS.map((user) => [user.userId, user])),
    []
  )

  const filteredProjects = useMemo(() => {
    let list = [...MOCK_PROJECT_CARDS]

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.categoryId === selectedCategory)
    }

    if (selectedSort === "likes") {
      list.sort((a, b) => b.likeCount - a.likeCount)
    } else if (selectedSort === "views") {
      list.sort((a, b) => b.viewCount - a.viewCount)
    } else if (selectedSort === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
    } else {
      list.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    }

    return list
  }, [selectedCategory, selectedSort])

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Featured Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Explore curated freelance work and recent showcase projects
          </p>
        </div>

        <Button
          variant="outline"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center gap-2 rounded-full border-neutral-200 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-700 shadow-xs hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer w-fit"
        >
          {isDark ? (
            <>
              <Sun className="size-4 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="size-4 text-neutral-700 dark:text-neutral-300" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <Dropdown
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
        <p className="text-xs text-muted-foreground">
          Showing {filteredProjects.length} published projects · newest first
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProjects.map((project) => {
          const author = userMap.get(project.freelanceId)

          return (
            <ProjectCard
              key={project.id}
              project={project}
              authorName={author?.name}
              authorAvatar={author?.avatarUrl}
              className="max-w-none"
            />
          )
        })}
      </div>
    </div>
  )
}

export default Home
