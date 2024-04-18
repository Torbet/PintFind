import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { drinks, styles } from '$lib/schema';
import { sql, eq, getTableColumns, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = locals;
	if (!user) return error(403, 'Forbidden');

	let query = url.searchParams.get('q');
	if (!query) return error(400, 'Bad Request');
	query = `%${query.replace(/\s+/g, '%')}%`;

	const results = await db
		.select({ ...getTableColumns(drinks), style: getTableColumns(styles) })
		.from(drinks)
		.where(
			or(
				sql`REPLACE(${drinks.name}, "'", "") LIKE ${query}`,
				sql`REPLACE(${styles.name}, "'", "") LIKE ${query}`
			)
		)
		.innerJoin(styles, eq(drinks.styleId, styles.id))
		.limit(5);

	return json(results);
};
