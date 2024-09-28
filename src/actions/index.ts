import { db } from "@lib/db";
import { reportTable } from "@lib/db/schema";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { getSession } from "auth-astro/server";

export const server = {
  updateReport: defineAction({
    accept: "form",
    input: z.object({
      report: z.string(),
      userId: z.string(),
    }),
    handler: async ({ report, userId }, context) => {
      const session = await getSession(context.request);

      if (!session?.user?.id) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "must be signedIn to like a blog",
        });
      }
      const result = await db
        .insert(reportTable)
        .values({
          userId,
          report,
        })
        .onConflictDoUpdate({
          target: reportTable.userId,
          set: { report: report },
        })
        .returning({ report: reportTable.report });

      if (!result.length) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "could not update like",
        });
      }

      return { report: result[0].report };
    },
  }),
};
