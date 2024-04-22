import { db } from './lib/db';
import { users } from '../src/lib/schema';
import { isNotNull, eq } from 'drizzle-orm';

const main = async () => {
	const usersWithAvatars = await db.select().from(users).where(isNotNull(users.avatar));
	usersWithAvatars.forEach(async (user) => {
		const { avatar } = user;
		const newAvatar = avatar?.replace('width=80', 'width=120');
		await db.update(users).set({ avatar: newAvatar }).where(eq(users.id, user.id));
	});
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
