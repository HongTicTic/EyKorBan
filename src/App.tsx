import { Header } from "./components/header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Footer } from "./components/footer"

export function App() {
  const path = window.location.pathname

  if (path === "/login") return <Login />
  if (path === "/signup") return <Signup />

  return (
    <>
      <Header />
      <Home/>
      <Footer />
    </>
  )
}

export default App
