"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { getUserIdTag } from "@/core/features/users/dbCache";
import { getUserByIdDb } from "@/core/features/users/db";
import { DatabaseError } from "@/core/dal/helpers";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  try {
    return await getUserByIdDb(id);
  } catch (error) {
    console.error("Database error getting user:", error);
    throw new DatabaseError("Failed to fetch user from database", error);
  }
}
