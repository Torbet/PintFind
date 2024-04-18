import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reviews, featuresToReviews } from '$lib/schema';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user) return error(401, 'Unauthorized');

	const { rating, price, currency, studentDiscount, comment, placeId, drinkId, featureIds } =
		await request.json();
	if (!rating || !price || !currency || !placeId || !drinkId || !comment) {
		console.log('Missing required fields', { rating, price, currency, placeId, drinkId });
		return error(400, 'Missing required fields');
	}

	const [review] = await db
		.insert(reviews)
		.values({
			rating,
			price,
			currency,
			studentDiscount,
			comment,
			placeId,
			drinkId,
			userId: user.id
		})
		.returning();

	if (featureIds.length > 0) {
		await db.insert(featuresToReviews).values(
			featureIds.map((featureId: string) => ({
				featureId,
				reviewId: review.id
			}))
		);
	}

	return json(review);
};
