/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import {
  LANGUAGES,
  translate,
  type Language,
  type MessageKey,
} from "@/lib/i18n"

type LanguageProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: MessageKey, params?: Record<string, string | number>) => string
}

const LanguageProviderContext = React.createContext<
  LanguageProviderState | undefined
>(undefined)

function isLanguage(value: string | null): value is Language {
  return value !== null && LANGUAGES.includes(value as Language)
}

/** First visit: follow the browser, so a phone set to Khmer opens in Khmer. */
function getBrowserLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("km") ? "km" : "en"
}

function readStored(storageKey: string): Language | null {
  try {
    const value = localStorage.getItem(storageKey)
    return isLanguage(value) ? value : null
  } catch {
    // Blocked storage — fall back to the browser language.
    return null
  }
}

export function LanguageProvider({
  children,
  storageKey = "language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = React.useState<Language>(
    () => readStored(storageKey) ?? getBrowserLanguage()
  )

  const setLanguage = React.useCallback(
    (nextLanguage: Language) => {
      try {
        localStorage.setItem(storageKey, nextLanguage)
      } catch {
        // Not being able to remember the choice is not worth surfacing.
      }
      setLanguageState(nextLanguage)
    },
    [storageKey]
  )

  // <html lang> tells screen readers which voice to use and lets index.css
  // loosen the line height for Khmer.
  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && isLanguage(event.newValue)) {
        setLanguageState(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [storageKey])

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: MessageKey, params?: Record<string, string | number>) =>
        translate(language, key, params),
    }),
    [language, setLanguage]
  )

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = React.useContext(LanguageProviderContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
