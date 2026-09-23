import { useMemo, useState } from "react"
import Dropdown from "@/components/dropdown"
import { ProjectCard } from "@/components/project-card"
import { useData } from "@/lib/use-data"

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedSort, setSelectedSort] = useState("recent")
  const { projectCards, users } = useData()

  const userMap = useMemo(
    () => new Map(users.map((user) => [user.userId, user])),
    [users]
  )

  const filteredProjects = useMemo(() => {
    let list = [...projectCards]

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
  }, [projectCards, selectedCategory, selectedSort])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Featured Projects
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Explore curated freelance work and recent showcase projects
        </p>
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
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No projects found matching the selected filters.
          </div>
        ) : (
          filteredProjects.map((project) => {
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
          })
        )}
      </div>
    </div>
  )
}

export default Home

