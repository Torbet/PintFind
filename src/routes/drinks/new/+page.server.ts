import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { drinks } from '$lib/schema';
import { slugify } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (!user) return redirect(302, '/login?redirect=/drinks/new');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) return redirect(302, '/login?redirect=/drinks/new');

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const styleId = formData.get('styleId') as string;

		await db
			.insert(drinks)
			.values({ name, slug: slugify(name), styleId, userId: user.id })
			.onConflictDoNothing();

		return redirect(302, '/review');
	}
};
