"use server";

import { getCurrentUser } from "@/core/services/clerk/lib/getCurrentUser";
import { getJobInfo } from "../jobInfos/db";
import { getInterviewById, insertInterview, updateInterviewDb } from "./db";

type CreateInterviewReturn = Promise<
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
      id: string;
    }
>;

export async function createInterview({
  jobInfoId,
}: {
  jobInfoId: string;
}): CreateInterviewReturn {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  // TODO: Permissions
  // TODO: Rate limit

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  const interview = await insertInterview({ jobInfoId, duration: "00:00:00" });

  return {
    error: false,
    id: interview.id,
  };
}

export async function updateInterview(
  id: string,
  interview: { humeChatId?: string; duration?: string }
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  const foundInterview = await getInterviewById(id, userId);
  if (foundInterview == null) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  await updateInterviewDb(id, interview);

  return { error: false };
}
