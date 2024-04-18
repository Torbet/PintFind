import placesData from './data/places.json';
import { db } from './lib/db';
import { places } from '../src/lib/schema';

const main = async () => {
	await db
		.insert(places)
		.values(placesData.map((p) => ({ ...p, createdAt: new Date() })))
		.onConflictDoNothing();
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
