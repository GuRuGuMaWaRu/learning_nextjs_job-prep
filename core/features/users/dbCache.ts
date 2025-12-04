import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/core/lib/dataCache";

export function getUserGlobalTag() {
  return getGlobalTag("users");
}

export function getUserIdTag(id: string) {
  return getIdTag(id, "users");
}

export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalTag(), "max");
  revalidateTag(getUserIdTag(id), "max");
}
