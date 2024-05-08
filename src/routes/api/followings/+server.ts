import type { RequestHandler } from './$types';
import { redirect, error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { followings, places } from '$lib/schema';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const placeId = url.searchParams.get('placeId');
	if (!placeId) return error(400, 'Missing placeId');
	const { user } = locals;
	if (!user) return json(false);
	const following = await db
		.select()
		.from(followings)
		.where(and(eq(followings.placeId, placeId), eq(followings.userId, user.id)));
	return json(!!following.length);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { placeId } = await request.json();
	if (!placeId) return error(400, 'Missing placeId');
	const { user } = locals;
	if (!user) return redirect(302, '/login');
	const [place] = await db.select().from(places).where(eq(places.id, placeId));
	if (!place) return error(404, 'Place not found');
	await db.insert(followings).values({ userId: user.id, placeId }).onConflictDoNothing();
	return redirect(302, `/places/${place.slug}`);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { placeId } = await request.json();
	if (!placeId) return error(400, 'Missing placeId');
	const { user } = locals;
	if (!user) return redirect(302, '/login');
	await db
		.delete(followings)
		.where(and(eq(followings.placeId, placeId), eq(followings.userId, user.id)));
	return json(true);
};
