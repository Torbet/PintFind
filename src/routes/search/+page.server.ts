import type { PageServerLoad } from './$types';
import { MAPBOX_TOKEN } from '$env/static/private';
import { db } from '$lib/server/db';
import { getTableColumns, sql, eq, desc, count, and, or, gte, lte, inArray } from 'drizzle-orm';
import { featuresToReviews, places, reviews } from '$lib/schema';
import { getFeatures } from '$lib/server/utils';

export const load: PageServerLoad = async ({ url, request }) => {
	const city = request.headers.get('cf-ipcity') || 'Edinburgh';
	const queryParam = url.searchParams.get('query') as string;
	const ratingParam = url.searchParams.get('rating') as string;
	const priceParam = url.searchParams.get('price') as string;

	const query = queryParam ? `%${queryParam.replace(/\s+/g, '%')}%` : city;
	const rating = ratingParam ? parseInt(ratingParam) : null;
	const price = priceParam ? parseInt(priceParam) : null;
	const featureParams = url.searchParams.get('features') as string | null;
	const features = featureParams ? featureParams.split(',') : null;
	const offset = url.searchParams.get('offset') as number | null;

	const results = await getResults(query, rating, price, features, offset);

	return { results, MAPBOX_TOKEN };
};

const getResults = async (
	query: string | null,
	rating: number | null,
	price: number | null,
	features: string[] | null,
	offset: number | null = 0
): Promise<PlaceWithData[]> => {
	const results = await db
		.select({
			...getTableColumns(places),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(places)
		.innerJoin(reviews, eq(places.id, reviews.placeId))
		.leftJoin(featuresToReviews, eq(reviews.id, featuresToReviews.reviewId))
		.groupBy(places.id)
		.where(
			and(
				query
					? or(
							sql`REPLACE(${places.name}, "'", "") LIKE ${query}`,
							sql`REPLACE(${places.street}, "'", "") LIKE ${query}`,
							sql`REPLACE(${places.city}, "'", "") LIKE ${query}`,
							sql`REPLACE(${places.country}, "'", "") LIKE ${query}`,
							sql`REPLACE(CONCAT(${places.name}, ${places.city}), "'", "") LIKE ${query}`
						)
					: undefined,
				features ? inArray(featuresToReviews.featureId, features) : undefined
			)
		)
		.having(({ avgRating, avgPrice }) =>
			and(rating ? gte(avgRating, rating) : undefined, price ? lte(avgPrice, price) : undefined)
		)
		.orderBy(desc(count(reviews.id)), desc(places.image))
		.limit(12);

	return await Promise.all(
		results.map(async (place) => {
			const features = await getFeatures(place.id);
			return { ...place, features };
		})
	);
};
