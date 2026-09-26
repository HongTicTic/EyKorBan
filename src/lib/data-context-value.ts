import { createContext } from "react"
import type { Job } from "@/interface/job"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"

export type DataContextValue = {
  users: User[]
  freelancerProfiles: FreelancerProfile[]
  projectCards: ProjectCard[]
  jobs: Job[]
}

export const initialData: DataContextValue = {
  users: [],
  freelancerProfiles: [],
  projectCards: [],
  jobs: [],
}

export const DataContext = createContext<DataContextValue>(initialData)