import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, reviews, places, drinks, styles } from '$lib/schema';
import { sql, eq, getTableColumns, desc, avg, count } from 'drizzle-orm';
import { getFeatures } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;
	const [user] = await db
		.select({
			...getTableColumns(users),
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(users)
		.where(eq(users.username, username))
		.leftJoin(reviews, eq(users.id, reviews.userId));
	if (!user) return error(404, 'User not found');

	const latestReviews = await getLatestReviews(user.id);
	const favouritePlaces = await getFavouritePlaces(user.id);
	const favouriteDrinks = await getFavouriteDrinks(user.id);

	return { user, latestReviews, favouritePlaces, favouriteDrinks };
};

const getLatestReviews = async (userId: string): Promise<ReviewWithData[]> => {
	const results = await db.query.reviews.findMany({
		where: (reviews, { and, eq, isNotNull }) =>
			and(eq(reviews.userId, userId), isNotNull(reviews.drinkId)),
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

const getFavouritePlaces = async (userId: string): Promise<PlaceWithData[]> => {
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
		.where(eq(reviews.userId, userId))
		.groupBy(places.id)
		.orderBy(desc(avg(reviews.rating)));

	return await Promise.all(
		results.map(async (place) => {
			const features = await getFeatures(place.id);
			return { ...place, features };
		})
	);
};

const getFavouriteDrinks = async (userId: string) => {
	const results = await db
		.select({
			...getTableColumns(drinks),
			style: getTableColumns(styles),
			avgRating: sql<number>`AVG(${reviews.rating})`,
			avgPrice: sql<number>`AVG(${reviews.price})`,
			currency: reviews.currency,
			reviewCount: sql<number>`COUNT(${reviews.id})`
		})
		.from(drinks)
		.innerJoin(reviews, eq(drinks.id, reviews.drinkId))
		.where(eq(reviews.userId, userId))
		.innerJoin(styles, eq(drinks.styleId, styles.id))
		.groupBy(drinks.id)
		.orderBy(desc(avg(reviews.rating)));

	return results;
};
