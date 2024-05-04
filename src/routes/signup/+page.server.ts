import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db';
import { users } from '$lib/schema';
import { lucia } from '$lib/server/auth';
import { LibsqlError } from '@libsql/client';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-zA-Z0-9_]+$/.test(username)
		) {
			return fail(400, { message: 'Invalid username.' });
		}

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

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match.' });
		}

		const hashedPassword = await new Argon2id().hash(password);

		try {
			const [user] = await db
				.insert(users)
				.values({ username: username.toLowerCase(), email, hashedPassword })
				.returning();
			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			if (e instanceof LibsqlError) {
				if (e.message.includes('username')) {
					return fail(400, { message: 'A user with that username already exists.' });
				}

				if (e.message.includes('email')) {
					return fail(400, { message: 'A user with that email already exists.' });
				}
			}

			return fail(500, { message: 'An unexpected error occurred.' });
		}

		const redirectUrl = url.searchParams.get('redirect');
		return redirect(302, redirectUrl || '/');
	}
};
