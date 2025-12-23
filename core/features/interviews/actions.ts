"use server";

import { cacheTag, refresh } from "next/cache";
import arcjet, { request, tokenBucket } from "@arcjet/next";

import {
  getInterviewByIdDb,
  getInterviewsDb,
  insertInterviewDb,
  updateInterviewDb,
} from "@/core/features/interviews/db";
import {
  getInterviewIdTag,
  getInterviewJobInfoTag,
} from "@/core/features/interviews/dbCache";
import { checkInterviewPermission } from "@/core/features/interviews/permissions";
import { getJobInfoIdTag } from "@/core/features/jobInfos/dbCache";
import { getJobInfo } from "@/core/features/jobInfos/actions";
import { getCurrentUser } from "@/core/features/auth/server";
import { PLAN_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE } from "@/core/lib/errorToast";
import { env } from "@/core/data/env/server";
import { generateAiInterviewFeedback } from "@/core/services/ai/interviews";
import { DatabaseError } from "@/core/dal/helpers";

const aj = arcjet({
  characteristics: ["userId"],
  key: env.ARCJET_KEY,
  rules: [
    tokenBucket({
      capacity: 12,
      refillRate: 4,
      interval: "1d",
      mode: "LIVE",
    }),
  ],
});

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

  const permitted = await checkInterviewPermission();
  if (!permitted) {
    return {
      error: true,
      message: PLAN_LIMIT_MESSAGE,
    };
  }

  const decision = await aj.protect(await request(), {
    userId,
    requested: 1,
  });
  if (decision.isDenied()) {
    return {
      error: true,
      message: RATE_LIMIT_MESSAGE,
    };
  }

  try {
    // getJobInfo now handles auth internally and throws on error
    const jobInfo = await getJobInfo(jobInfoId);
    if (jobInfo == null) {
      return {
        error: true,
        message: "You don't have permission to do this.",
      };
    }

    const interview = await insertInterviewDb({
      jobInfoId,
      duration: "00:00:00",
    });

    return {
      error: false,
      id: interview.id,
    };
  } catch (error) {
    console.error("Error creating interview:", error);
    return {
      error: true,
      message: "Failed to create interview. Please try again.",
    };
  }
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

  try {
    const foundInterview = await getInterviewByIdDb(id);
    if (foundInterview == null)
      return { error: true, message: "You don't have permission to do this." };
    if (foundInterview.jobInfo.userId !== userId)
      return { error: true, message: "You don't have permission to do this." };

    await updateInterviewDb(id, interview);

    return { error: false };
  } catch (error) {
    console.error("Error updating interview:", error);
    return {
      error: true,
      message: "Failed to update interview. Please try again.",
    };
  }
}

export async function getInterviewById(id: string, userId: string) {
  "use cache";
  cacheTag(getInterviewIdTag(id));

  try {
    const foundInterview = await getInterviewByIdDb(id);
    if (foundInterview == null) return null;

    cacheTag(getJobInfoIdTag(foundInterview.jobInfo.id));

    if (foundInterview.jobInfo.userId !== userId) return null;
    return foundInterview;
  } catch (error) {
    console.error("Database error getting interview:", error);
    throw new DatabaseError("Failed to fetch interview from database", error);
  }
}

export async function canCreateInterview(): Promise<boolean> {
  return await checkInterviewPermission();
}

export async function getInterviews(jobInfoId: string, userId: string) {
  "use cache";
  cacheTag(getInterviewJobInfoTag(jobInfoId));
  cacheTag(getJobInfoIdTag(jobInfoId));

  try {
    return await getInterviewsDb(jobInfoId, userId);
  } catch (error) {
    console.error("Database error getting interviews:", error);
    throw new DatabaseError("Failed to fetch interviews from database", error);
  }
}

export async function generateInterviewFeedback(interviewId: string) {
  const { userId, user } = await getCurrentUser({
    allData: true,
  });
  if (userId == null || user == null) {
    return {
      error: true,
      message: "You don't have permission to do this",
    };
  }

  const interview = await getInterviewById(interviewId, userId);

  if (interview == null) {
    return {
      error: true,
      message: "You don't have permission to do this",
    };
  }

  if (interview.humeChatId == null) {
    return {
      error: true,
      message: "Interview has not been completed yet",
    };
  }

  try {
    const feedback = await generateAiInterviewFeedback({
      humeChatId: interview.humeChatId as string,
      jobInfo: interview.jobInfo,
      userName: user.name,
    });

    if (feedback == null) {
      return {
        error: true,
        message: "Failed to generate feedback",
      };
    }

    await updateInterviewDb(interviewId, { feedback });
    refresh();

    return { error: false };
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    return {
      error: true,
      message: "Failed to generate feedback. Please try again.",
    };
  }
}
