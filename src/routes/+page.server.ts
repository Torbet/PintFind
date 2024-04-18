import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { places, drinks, reviews } from '$lib/schema';
import { count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const counts = await getCounts();
	const latestReviews = await getLatestReviews();
	return { counts, latestReviews };
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
