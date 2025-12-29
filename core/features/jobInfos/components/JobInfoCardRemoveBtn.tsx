"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { removeJobInfoAction } from "@/core/features/jobInfos/actions";
import { JobInfoTable } from "@/core/drizzle/schema";

export function JobInfoCardRemoveBtn({
  jobInfo,
}: {
  jobInfo: typeof JobInfoTable.$inferSelect;
}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleRemoveJobInfo() {
    startTransition(async () => {
      const data = await removeJobInfoAction(jobInfo.id);
      if (data) {
        toast.success(`Job info for "${jobInfo.name}" removed successfully`);
        router.refresh();
      }
    });
  }

  return (
    <Button
      className="w-full h-1/2 delete-button"
      variant="ghost"
      onClick={handleRemoveJobInfo}
      disabled={isLoading}>
      <TrashIcon className="size-4 text-destructive" />
    </Button>
  );
}
