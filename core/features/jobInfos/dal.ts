import { cacheTag } from "next/cache";

import {
  createJobInfoDb,
  getJobInfoByIdDb,
  getJobInfoDb,
  updateJobInfoDb,
  getJobInfosDb,
} from "./db";
import { getJobInfoIdTag, getJobInfoGlobalTag } from "./dbCache";
import { NotFoundError, DatabaseError } from "@/core/dal/helpers";
import { JobInfoTable } from "@/core/drizzle/schema";

/**
 * DAL Layer for JobInfo
 * Handles: Data access, caching, error translation
 * Throws: NotFoundError, DatabaseError
 */

/**
 * Create a new job info entry in the database
 */
export async function createJobInfoDal(data: typeof JobInfoTable.$inferInsert) {
  try {
    return await createJobInfoDb(data);
  } catch (error) {
    console.error("Database error creating job info:", error);
    throw new DatabaseError(
      "Failed to save job information to database",
      error
    );
  }
}

/**
 * Get job info by ID
 */
export async function getJobInfoDal(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  const jobInfo = await getJobInfoDb(id, userId);

  if (!jobInfo) {
    throw new NotFoundError(
      "Job posting not found or you don't have access to it"
    );
  }

  return jobInfo;
}

/**
 * Get job info by ID
 */
export async function getJobInfoByIdDal(id: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  const jobInfo = await getJobInfoByIdDb(id);

  if (!jobInfo) {
    throw new NotFoundError("Job posting not found");
  }

  return jobInfo;
}

/**
 * Get all job infos for the specified user
 */
export async function getJobInfosDal(userId: string) {
  "use cache";
  cacheTag(getJobInfoGlobalTag());

  return await getJobInfosDb(userId);
}

/**
 * Update job info by ID
 */
export async function updateJobInfoDal(
  id: string,
  data: Partial<typeof JobInfoTable.$inferInsert>
) {
  try {
    return await updateJobInfoDb(id, data);
  } catch (error) {
    console.error("Database error updating job info:", error);
    throw new DatabaseError(
      "Failed to update job information in database",
      error
    );
  }
}
