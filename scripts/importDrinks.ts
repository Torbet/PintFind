import drinksJson from './data/drinks.json';
import stylesData from './data/styles.json';
import { db } from './lib/db';
import { drinks, styles } from '../src/lib/schema';

const main = async () => {
	await db.insert(styles).values(stylesData).onConflictDoNothing();
	const drinksArray = drinksJson as any[];
	while (drinksArray.length) {
		await db.insert(drinks).values(drinksArray.splice(0, 1000)).onConflictDoNothing();
	}
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
