import { useAsyncData } from "@/hooks/use-async-data"
import {
  getWorkById,
  listRelatedWork,
  type PortfolioListItem,
} from "@/services/portfolio"

export interface WorkDetail {
  item: PortfolioListItem
  related: PortfolioListItem[]
}

/**
 * FR-004 / FR-005: one published work item and the related work shown under
 * it. Related work is picked by the item's category, so it waits for the item
 * rather than loading in parallel. An id that does not exist, or that RLS
 * hides, fails like any other load.
 */
export function useWorkDetail(id: string | undefined) {
  return useAsyncData<WorkDetail | null>(async () => {
    if (!id) return null

    const item = await getWorkById(id)
    const related = await listRelatedWork(item.card)
    return { item, related }
  }, [id])
}
