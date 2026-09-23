import { useEffect, useState, type ReactNode } from "react"
import { DataContext, initialData } from "@/lib/data-context-value"
import {
  listFreelancerProfiles,
  listJobs,
  listProjectCards,
  listUsers,
} from "@/lib/repositories"
import type { DataContextValue } from "@/lib/data-context-value"

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataContextValue>(initialData)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      listUsers(),
      listFreelancerProfiles(),
      listProjectCards(),
      listJobs(),
    ]).then(([users, freelancerProfiles, projectCards, jobs]) => {
      if (isMounted) setData({ users, freelancerProfiles, projectCards, jobs })
    }).catch(() => {
      // Keep the static data visible when a project is not configured yet.
    })

    return () => {
      isMounted = false
    }
  }, [])

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}
