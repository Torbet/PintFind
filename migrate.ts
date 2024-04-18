import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';

const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN
});
const db = drizzle(client);

await migrate(db, { migrationsFolder: 'migrations' });
client.close();

console.log('🍻 MIGRATIONS COMPLETE 🍻');
