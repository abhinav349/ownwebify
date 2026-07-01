"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const statuses = [
  { value: "NEW", label: "New" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "QUOTED", label: "Quoted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function StatusUpdateForm({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Select
        options={statuses}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className="w-full"
        size="sm"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Update Status"
        )}
      </Button>
    </div>
  );
}
