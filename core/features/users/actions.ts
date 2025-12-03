"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { getUserIdTag } from "./dbCache";
import { getUserById } from "./db";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return await getUserById(id);
}
