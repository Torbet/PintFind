import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { S3 } from '$lib/server/S3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '$lib/server/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (!user) return redirect(302, '/login');

	return { user };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { user } = locals;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const avatar = formData.get('avatar');
		if (avatar instanceof File) {
			if (avatar.name) {
				const Key = `avatars/${user.username}-${avatar.name}`;
				await S3.send(
					new PutObjectCommand({
						Bucket: 'pintfind',
						Key,
						Body: (await avatar.arrayBuffer()) as Buffer
					})
				);
				const objUrl = `https://cdn.pintfind.com/${Key.replaceAll('/', '%2F')}`;
				const url = 'https://pintfind.com/cdn-cgi/image/width=120,format=auto/' + objUrl;
				await db.update(users).set({ avatar: url }).where(eq(users.id, user.id));
			} else {
				await db.update(users).set({ avatar: null }).where(eq(users.id, user.id));
			}
		}

		return { ok: true };
	}
};
