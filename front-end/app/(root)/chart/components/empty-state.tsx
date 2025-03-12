import { Icon } from "@iconify/react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray">
      <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
      <p className="text-lg">No records this month</p>
    </div>
  )
}

