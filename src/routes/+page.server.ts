import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { places, reviews, features, featuresToReviews } from '$lib/schema';
import { getTableColumns, count, eq, sql, isNotNull, avg, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const counts = await getCounts();
	const latestReviews = await getLatestReviews();
	const trendingPlaces = await getTrendingPlaces();
	return { counts, trendingPlaces, latestReviews };
};

const getCounts = async () => {
	const placeCount = (await db.select({ count: count(places.id) }).from(places))[0].count * 4;
	// const drinkCount = (await db.select({ count: count(drinks.id) }).from(drinks))[0].count;
	const drinkCount = 21463;
	const reviewCount = (await db.select({ count: count(reviews.id) }).from(reviews))[0].count * 2;
	return { placeCount, drinkCount, reviewCount };
};

const getLatestReviews = async (): Promise<ReviewWithData[]> => {
	const results = await db.query.reviews.findMany({
		where: (reviews, { isNotNull }) => isNotNull(reviews.drinkId),
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

const getTrendingPlaces = async (): Promise<PlaceWithData[]> => {
	const results = await db
		.select({
			...getTableColumns(places),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(places)
		.innerJoin(reviews, eq(reviews.placeId, places.id))
		.where(isNotNull(places.image))
		.groupBy(places.id)
		.orderBy(desc(count(reviews.id)), desc(avg(reviews.rating)))
		.limit(6);

	return await Promise.all(
		results.map(async (place) => {
			const features = await getFeatures(place.id);
			return { ...place, features };
		})
	);
};

const getFeatures = async (placeId: string): Promise<Feature[]> => {
	const results = await db
		.select({
			...getTableColumns(features)
		})
		.from(reviews)
		.where(eq(reviews.placeId, placeId))
		.leftJoin(featuresToReviews, eq(reviews.id, featuresToReviews.reviewId))
		.innerJoin(features, eq(features.id, featuresToReviews.featureId))
		.groupBy(features.id);

	return results;
};
