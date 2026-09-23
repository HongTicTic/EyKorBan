import { useContext } from "react"
import { DataContext } from "@/lib/data-context-value"

export function useData() {
  return useContext(DataContext)
}