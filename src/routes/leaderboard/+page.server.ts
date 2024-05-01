import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, reviews } from '$lib/schema';
import { and, eq, sql, getTableColumns, count, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const month = new Date().toLocaleString('default', { month: '2-digit' });

	const topUsers = await db
		.select({
			...getTableColumns(users),
			reviewCount: count(reviews.id)
		})
		.from(users)
		.innerJoin(
			reviews,
			and(
				eq(users.id, reviews.userId),
				sql`strftime('%m', datetime(${reviews.createdAt}, 'unixepoch')) = ${month}`
			)
		)
		.groupBy(users.id)
		.orderBy(desc(count(reviews.id)))
		.limit(10);

	return { topUsers };
};
