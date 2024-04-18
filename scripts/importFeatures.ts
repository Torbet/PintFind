import featuresData from './data/features.json';
import { db } from './lib/db';
import { features } from '../src/lib/schema';

const main = async () => {
	await db.insert(features).values(featuresData).onConflictDoNothing();
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
