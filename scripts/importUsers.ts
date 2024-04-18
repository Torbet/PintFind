import usersData from './data/users.json';
import { db } from './lib/db';
import { users } from '../src/lib/schema';

const main = async () => {
	await db.insert(users).values(usersData).onConflictDoNothing();
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
