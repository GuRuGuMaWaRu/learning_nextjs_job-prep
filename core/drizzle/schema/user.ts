import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

import { JobInfoTable } from "./jobInfo";
import { createdAt, updatedAt } from "../schemaHelpers";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  image: varchar(),
  passwordHash: varchar("password_hash"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(UserTable, ({ many }) => ({
  jobInfo: many(JobInfoTable),
}));
