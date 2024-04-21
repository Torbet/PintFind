import type { PageServerLoad } from './$types';
import { MAPBOX_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { places, reviews, drinks } from '$lib/schema';
import { eq, sql, getTableColumns, count, desc, and } from 'drizzle-orm';
import { getFeatures } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals;
	const { slug } = params;

	const [place] = await db
		.select({
			...getTableColumns(places),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			reviewCount: sql<number>`COUNT(${reviews.id})`,
			currency: reviews.currency
		})
		.from(places)
		.where(eq(places.slug, slug))
		.leftJoin(reviews, eq(places.id, reviews.placeId));
	if (!place) return error(404, 'Place not found');

	const features = await getFeatures(place.id);
	const ratings = await getRatings(place.id);
	const latestReviews = await getLatestReviews(place.id);
	const menu = await getMenu(place.id);
	const userReview: { rating: number; createdAt: Date } | null = user
		? (
				await db
					.select()
					.from(reviews)
					.where(and(eq(reviews.placeId, place.id), eq(reviews.userId, user.id)))
			)[0]
		: null;

	return { place, features, ratings, latestReviews, menu, userReview, MAPBOX_TOKEN };
};

const getMenu = async (placeId: string) => {
	const results = await db
		.select({
			...getTableColumns(drinks),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(reviews)
		.innerJoin(drinks, eq(drinks.id, reviews.drinkId))
		.innerJoin(places, eq(places.id, reviews.placeId))
		.where(eq(reviews.placeId, placeId))
		.groupBy(drinks.id)
		.orderBy(desc(sql`COUNT(${reviews.id})`));

	return results;
};

const getLatestReviews = async (placeId: string): Promise<ReviewWithData[]> => {
	const results = await db.query.reviews.findMany({
		where: (reviews, { and, eq, isNotNull }) =>
			and(eq(reviews.placeId, placeId), isNotNull(reviews.drinkId)),
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

const getRatings = async (placeId: string): Promise<{ rating: number; count: number }[]> => {
	const results = await db
		.select({
			rating: reviews.rating,
			count: count(reviews.id)
		})
		.from(places)
		.where(eq(places.id, placeId))
		.leftJoin(reviews, eq(places.id, reviews.placeId))
		.groupBy(reviews.rating);

	const ratings = Array.from({ length: 5 }, (_, i) => {
		const result = results.find((r) => r.rating === i + 1);
		return result || { rating: i + 1, count: 0 };
	});

	return ratings.reverse() as { rating: number; count: number }[];
};
