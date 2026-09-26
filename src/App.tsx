import { lazy, Suspense } from "react"
import {
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router"
import { FileQuestion } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { EmptyState } from "@/components/empty-state"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { RequireAuth } from "@/components/require-auth"
import { MobileNav } from "@/components/mobile-nav"
import { Sidebar } from "@/components/sidebar"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { RoleName } from "@/interface/user"
import { cn } from "@/lib/utils"
import Home from "@/pages/Home"

// Lesson 7.6: one chunk per route instead of one chunk for the app. Home is
// imported eagerly because it is the landing screen — lazy-loading the first
// thing a visitor sees only delays it. Everything else loads on demand.
const FindWork = lazy(() => import("@/pages/FindWork"))
const HireCreatives = lazy(() => import("@/pages/HireCreatives"))
const JobDetail = lazy(() => import("@/pages/JobDetail"))
const JobEditor = lazy(() => import("@/pages/JobEditor"))
const Login = lazy(() => import("@/pages/Login"))
const MyJobs = lazy(() => import("@/pages/MyJobs"))
const MyWork = lazy(() => import("@/pages/MyWork"))
const PortfolioDetail = lazy(() => import("@/pages/PortfolioDetail"))
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"))
const Projects = lazy(() => import("@/pages/Projects"))
const Profile = lazy(() => import("@/pages/Profile"))
const StartProject = lazy(() => import("@/pages/StartProject"))
const Signup = lazy(() => import("@/pages/Signup"))
const WorkEditor = lazy(() => import("@/pages/WorkEditor"))

/** Shown while a route chunk downloads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}

/** Shell shared by every page except the auth screens. */
function AppLayout() {
  const { user } = useAuth()

  return (
    <div className="flex h-dvh overflow-hidden">
      {user && <Sidebar user={user} />}

      {/* pb-14 clears the fixed bottom tab bar on phones. */}
      <div className="flex flex-1 flex-col overflow-y-auto pb-14 md:pb-0">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      <MobileNav />
    </div>
  )
}

/** Route adapters: turn URL params into the props these pages already take. */
function WorkDetailRoute() {
  const { id } = useParams()
  const navigate = useNavigate()

  return <PortfolioDetail projectId={id} onBack={() => navigate(-1)} />
}

function ProfileRoute() {
  const { username } = useParams()
  return <Profile username={username} />
}

function NotFound() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="That address does not match anything on the platform."
        action={
          <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to browsing
          </Link>
        }
      />
    </div>
  )
}

export function App() {
  const { isLoading } = useAuth()

  // Hold the first paint until the session is known, so the sidebar does not
  // flash the signed-out layout for a returning user.
  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Auth screens render without the app shell. */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppLayout />}>
          {/* Public — browsing never requires an account. */}
          <Route index element={<Home />} />
          <Route path="hire-creatives" element={<HireCreatives />} />
          <Route path="find-work" element={<FindWork />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="work/:id" element={<WorkDetailRoute />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:username" element={<ProfileRoute />} />

          {/* Project engagement (STORY-014 … STORY-019). Both actors share
              these routes, so the guard checks for a session rather than a
              role; RLS decides what each one can see. */}
          <Route element={<RequireAuth />}>
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="start-project/:from/:id" element={<StartProject />} />
          </Route>

          {/* Freelancer portal (FR-007 … FR-012). "work/new" is declared before
              "work/:id" for readability; the router ranks static segments higher
              regardless of order. */}
          <Route element={<RequireAuth role={RoleName.FREELANCER} />}>
            <Route path="my-work" element={<MyWork />} />
            <Route path="work/new" element={<WorkEditor />} />
            <Route path="work/:id/edit" element={<WorkEditor />} />
          </Route>

          {/* Client job management (FR-016, FR-018). */}
          <Route element={<RequireAuth role={RoleName.CLIENT} />}>
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="jobs/new" element={<JobEditor />} />
            <Route path="jobs/:id/edit" element={<JobEditor />} />
          </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </Suspense>
  )
}

export default App
