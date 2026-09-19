import { Header } from "./components/header"
import Home from "./pages/Home"
import { Footer } from "./components/footer"
import { Sidebar } from "./components/sidebar"
import { RoleName } from "./interface/user"
import type { User } from "./interface/user"

// Demo user — replace with real auth context when auth is ready
const demoFreelancer: User = {
  userId: "usr_001",
  name: "Mira Renko",
  role: RoleName.FREELANCER,
  email: "mira@example.com",
  avatarUrl: "https://github.com/shadcn.png",
  status: "ACTIVE",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

export function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — rendered only for portal roles */}
      <Sidebar user={demoFreelancer} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1">
          <Home />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
