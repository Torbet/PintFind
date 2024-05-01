import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { places } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) return redirect(302, '/login');
	const placeId = url.searchParams.get('placeId');
	if (!placeId) return { place: null };
	const [place] = await db.select().from(places).where(eq(places.id, placeId));
	return { place };
};
