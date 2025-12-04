import { cacheTag } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/core/drizzle/db";
import { JobInfoTable } from "@/core/drizzle/schema";
import {
  getJobInfoIdTag,
  revalidateJobInfoCache,
} from "@/core/features/jobInfos/dbCache";

export async function insertJobInfoDb(
  jobInfo: typeof JobInfoTable.$inferInsert
) {
  const [newJobInfo] = await db.insert(JobInfoTable).values(jobInfo).returning({
    id: JobInfoTable.id,
    userId: JobInfoTable.userId,
  });

  revalidateJobInfoCache(newJobInfo);

  return newJobInfo;
}

export async function updateJobInfoDb(
  id: string,
  jobInfo: Partial<typeof JobInfoTable.$inferInsert>
) {
  const [updatedJobInfo] = await db
    .update(JobInfoTable)
    .set(jobInfo)
    .where(eq(JobInfoTable.id, id))
    .returning({
      id: JobInfoTable.id,
      userId: JobInfoTable.userId,
    });

  revalidateJobInfoCache(updatedJobInfo);

  return updatedJobInfo;
}

export async function getJobInfoDb(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}

export async function getJobInfoByIdDb(id: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: eq(JobInfoTable.id, id),
  });
}

export async function getJobInfosDb(userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(userId));

  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}
