import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { drinks, styles, reviews } from '$lib/schema';
import { sql, eq, getTableColumns, count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const [drink] = await db
		.select({
			...getTableColumns(drinks),
			style: getTableColumns(styles),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(drinks)
		.where(eq(drinks.slug, slug))
		.innerJoin(styles, eq(drinks.styleId, styles.id))
		.leftJoin(reviews, eq(drinks.id, reviews.drinkId));
	if (!drink) return error(404, 'Drink not found');

	const latestReviews = await getLatestReviews(drink.id);
	const ratings = await getRatings(drink.id);

	return { drink, latestReviews, ratings };
};

const getLatestReviews = async (drinkId: string): Promise<ReviewWithData[]> => {
	const results = await db.query.reviews.findMany({
		where: (reviews, { and, eq }) => and(eq(reviews.drinkId, drinkId)),
		orderBy: (reviews, { desc }) => desc(reviews.createdAt),
		limit: 6,
		with: {
			user: true,
			place: true,
			drink: true,
			featuresToReviews: { with: { feature: true } }
		}
	});

	return results.map((review) => {
		const { featuresToReviews, ...rest } = review;
		return {
			...rest,
			features: featuresToReviews.map((ftr) => ftr.feature),
			drink: review.drink! // Add non-null assertion operator
		};
	});
};

const getRatings = async (drinkId: string): Promise<{ rating: number; count: number }[]> => {
	const results = await db
		.select({
			rating: reviews.rating,
			count: count(reviews.id)
		})
		.from(drinks)
		.where(eq(drinks.id, drinkId))
		.leftJoin(reviews, eq(reviews.drinkId, drinks.id))
		.groupBy(reviews.rating);

	const ratings = Array.from({ length: 5 }, (_, i) => {
		const result = results.find((r) => r.rating === i + 1);
		return result || { rating: i + 1, count: 0 };
	});

	return ratings.reverse() as { rating: number; count: number }[];
};
