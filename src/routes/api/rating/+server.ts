import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reviews } from '$lib/schema';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user) return error(401, 'Unauthorized');

	const { rating, placeId } = await request.json();
	if (!rating || !placeId) return error(400, 'Missing required fields');

	const [result] = await db
		.insert(reviews)
		.values({
			rating,
			placeId,
			userId: user.id
		})
		.returning();

	return json(result);
};
