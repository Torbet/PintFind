import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { LegacyScrypt } from 'lucia';
import { db } from '$lib/server/db';
import { users } from '$lib/schema';
import { lucia } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (
			typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 255 ||
			!/^[^@]+@[^@]+$/.test(email)
		) {
			return fail(400, { message: 'Invalid email.' });
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Invalid password.' });
		}

		const [user] = await db.select().from(users).where(eq(users.email, email));
		if (!user || !user.hashedPassword) {
			return fail(400, { message: 'Invalid email or password.' });
		}
		if (user.hashedPassword.startsWith('s2')) {
			const validPassword = await new LegacyScrypt().verify(user.hashedPassword, password);
			if (!validPassword) {
				return fail(400, { message: 'Invalid email or password.' });
			} else {
				const hashedPassword = await new Argon2id().hash(password);
				await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));
			}
		} else {
			const validPassword = await new Argon2id().verify(user.hashedPassword, password);
			if (!validPassword) {
				return fail(400, { message: 'Invalid email or password.' });
			}
		}
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/');
	}
};
