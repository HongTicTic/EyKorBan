import { Header } from "./components/header"
import FindWork from "./pages/FindWork"
import HireCreatives from "./pages/HireCreatives"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Signup from "./pages/Signup"
import { Footer } from "./components/footer"
import { Sidebar } from "./components/sidebar"
import { RoleName } from "./interface/user"
import type { User } from "./interface/user"
import { DataProvider } from "./lib/data-context"

// Demo user — replace with real auth context when auth is ready
const demoFreelancer: User = {
  userId: "usr_001",
  name: "Mira Renko",
  role: RoleName.CLIENT,
  email: "mira@example.com",
  avatarUrl: "https://github.com/shadcn.png",
  status: "ACTIVE",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

function getPage(path: string) {
  if (path === "./hire-creatives") return <HireCreatives />
  if (path === "./find-work") return <FindWork />
  if (path === "./profile") return <Profile />
  if (path.startsWith("./profile/")) {
    return <Profile username={decodeURIComponent(path.split("/")[2])} />
  }
  return <Home />
}

export function App() {
  const path = window.location.pathname

  if (path === "./login") return <Login />
  if (path === "./signup") return <Signup />

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden">
      {/* Sidebar — rendered only for portal roles */}
      <Sidebar user={demoFreelancer} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1">{getPage(path)}</main>
        <Footer />
      </div>
      </div>
    </DataProvider>
  )
}

export default App
