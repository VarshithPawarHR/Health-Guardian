import { relations, sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  role: text("role", { enum: ["PATIENT", "DOCTOR"] })
    .default("PATIENT")
    .notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  joinedOn: text("joined_on")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  photo: text("photo"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const accountsTableRelations = relations(accounts, ({ one }) => ({
  user: one(userTable, {
    fields: [accounts.userId],
    references: [userTable.id],
  }),
}));
