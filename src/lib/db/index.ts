import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.TURSO_CONNECTION_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client, { schema });