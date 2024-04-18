import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const { session } = locals;
	if (!session) return redirect(302, '/login');
	await lucia.invalidateSession(session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, { path: '.', ...sessionCookie.attributes });
	return redirect(302, '/login');
};
