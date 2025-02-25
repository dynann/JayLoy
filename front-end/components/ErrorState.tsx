import { Icon } from "@iconify/react";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center justify-center py-20 text-red-500">
      <Icon icon="mdi:alert-circle-outline" className="h-16 w-16 mb-4" />
      <p className="description-medium">{message}</p>
    </div>
  </div>
);