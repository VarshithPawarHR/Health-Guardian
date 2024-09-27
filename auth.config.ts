import Google from '@auth/core/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@lib/db';
import { accounts, userTable } from '@lib/db/schema';
import { defineConfig } from 'auth-astro';
import { eq } from 'drizzle-orm';

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.AUTH_GOOGLE_ID,
      clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await db.query.userTable.findFirst({
        where: eq(userTable.id, token.sub),
      });
      if (!user) return token;
      token = {
        ...token,
        email: user.email,
        name: user.name,
      };
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) return session;
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accounts,
  }),
  session: { strategy: 'jwt', maxAge: 365 * 24 * 60 * 60 },
});