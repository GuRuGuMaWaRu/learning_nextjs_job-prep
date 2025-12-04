import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { db } from "@/core/drizzle/db";
import { InterviewTable } from "@/core/drizzle/schema";
import {
  getInterviewIdTag,
  revalidateInterviewCache,
} from "@/core/features/interviews/dbCache";
import { getJobInfoIdTag } from "@/core/features/jobInfos/dbCache";

export async function getInterviewByIdDb(id: string, userId: string) {
  "use cache";
  cacheTag(getInterviewIdTag(id));

  const interview = await db.query.InterviewTable.findFirst({
    where: eq(InterviewTable.id, id),
    with: {
      jobInfo: {
        columns: {
          id: true,
          userId: true,
          title: true,
        },
      },
    },
  });

  if (interview == null) return null;

  cacheTag(getJobInfoIdTag(interview.jobInfo.id));

  if (interview.jobInfo.userId !== userId) return null;

  return interview;
}

export async function insertInterviewDb(
  interview: typeof InterviewTable.$inferInsert
) {
  const [newInterview] = await db
    .insert(InterviewTable)
    .values(interview)
    .returning({ id: InterviewTable.id, jobInfoId: InterviewTable.jobInfoId });

  revalidateInterviewCache({
    id: newInterview.id,
    jobInfoId: newInterview.jobInfoId,
  });

  return newInterview;
}

export async function updateInterviewDb(
  id: string,
  interview: Partial<typeof InterviewTable.$inferInsert>
) {
  const [updatedInterview] = await db
    .update(InterviewTable)
    .set(interview)
    .where(eq(InterviewTable.id, id))
    .returning({ id: InterviewTable.id, jobInfoId: InterviewTable.jobInfoId });

  revalidateInterviewCache({
    id: updatedInterview.id,
    jobInfoId: updatedInterview.jobInfoId,
  });

  return updatedInterview;
}
