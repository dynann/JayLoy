import { Icon } from "@iconify/react";

export const LoadingState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <Icon icon="svg-spinners:180-ring" className="h-16 w-16 mb-4" />
      <p className="description-medium">Loading...</p>
    </div>
  </div>
);