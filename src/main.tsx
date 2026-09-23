import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "@/components/auth-provider.tsx"
import { OutboxProvider } from "@/components/outbox-provider.tsx"
import { PwaStatus } from "@/components/pwa-status.tsx"
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { isSupabaseConfigured } from "@/lib/supabase.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      {isSupabaseConfigured ? (
        <BrowserRouter>
          <AuthProvider>
            <OutboxProvider>
              <PwaStatus />
              <App />
            </OutboxProvider>
          </AuthProvider>
        </BrowserRouter>
      ) : (
        <SupabaseSetupNotice />
      )}
    </ThemeProvider>
  </StrictMode>
)
