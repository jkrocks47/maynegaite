import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
	if (!_db) {
		const pool = new pg.Pool({
			connectionString: env.DATABASE_URL
		});
		_db = drizzle(pool, { schema });
	}
	return _db;
}

// For backwards compatibility — lazy getter
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_target, prop) {
		return (getDb() as any)[prop];
	}
});
