import type { PageServerLoad } from './$types';
import { MAPBOX_TOKEN } from '$env/static/private';
import { db } from '$lib/server/db';
import { places, reviews, featuresToReviews, features } from '$lib/schema';
import { eq, and, gte, lte, getTableColumns, sql, inArray, desc, or, between } from 'drizzle-orm';

let coorinateTolerance = 0.2;

export const load: PageServerLoad = async ({ url, request }) => {
	// get queries from url
	const searchQuery = url.searchParams.get('q');
	const query = searchQuery ? `%${searchQuery.replace(/\s+/g, '%')}%` : undefined;
	const rating = Number(url.searchParams.get('r'));
	const price = Number(url.searchParams.get('p'));
	const featureIds = url.searchParams.get('f')?.split(',');

	const latitude = Number(request.headers.get('x-vercel-ip-latitude')) || 55.9533;
	const longitude = Number(request.headers.get('x-vercel-ip-longitude')) || -3.1883;

	let results = await db
		.select({
			...getTableColumns(places),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(places)
		.leftJoin(reviews, eq(reviews.placeId, places.id))
		.leftJoin(featuresToReviews, eq(featuresToReviews.reviewId, reviews.id))
		.leftJoin(features, eq(features.id, featuresToReviews.featureId))
		.groupBy(places.id)
		.limit(12)
		.orderBy(desc(sql`COUNT(${reviews.id})`), desc(places.image))
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
				featureIds ? inArray(features.id, featureIds) : undefined,
				!query && !featureIds && !rating && !price ? eq(places.city, 'Edinburgh') : undefined
			)
		)
		.having(({ avgRating, avgPrice }) =>
			and(rating ? gte(avgRating, rating) : undefined, price ? lte(avgPrice, price) : undefined)
		);

	const avgLng = results.reduce((acc, place) => acc + place.longitude, 0) / results.length;
	const avgLat = results.reduce((acc, place) => acc + place.latitude, 0) / results.length;
	const center = [avgLng, avgLat] as [number, number];

	results = await Promise.all(
		results.map(async (place) => {
			const features = await getFeatures(place.id);
			return { ...place, features };
		})
	);

	return { results, MAPBOX_TOKEN, center };
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
