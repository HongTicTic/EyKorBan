import { createContext } from "react"
import type { Job } from "@/interface/job"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"
import {
  MOCK_FREELANCER_PROFILES,
  MOCK_JOBS,
  MOCK_PROJECT_CARDS,
  MOCK_USERS,
} from "@/mock-data/mock-data"

export type DataContextValue = {
  users: User[]
  freelancerProfiles: FreelancerProfile[]
  projectCards: ProjectCard[]
  jobs: Job[]
}

export const initialData: DataContextValue = {
  users: MOCK_USERS,
  freelancerProfiles: MOCK_FREELANCER_PROFILES,
  projectCards: MOCK_PROJECT_CARDS,
  jobs: MOCK_JOBS,
}

export const DataContext = createContext<DataContextValue>(initialData)