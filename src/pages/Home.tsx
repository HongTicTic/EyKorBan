import { ProjectCard } from "@/components/project-card"
import { MOCK_PROJECT_CARDS, MOCK_USERS } from "@/mock-data/mock-data"

const Home = () => {
  const userMap = new Map(MOCK_USERS.map((user) => [user.userId, user]))

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
