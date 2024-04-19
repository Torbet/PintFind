import { users, places, drinks, styles, reviews, features } from '$lib/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type User = typeof users.$inferSelect;
	type Place = typeof places.$inferSelect;
	type Drink = typeof drinks.$inferSelect;
	type Style = typeof styles.$inferSelect;
	type Review = typeof reviews.$inferSelect;
	type Feature = typeof features.$inferSelect;

	type DrinkWithStyle = Drink & { style: Style };
	type PlaceWithData = Place & {
		avgRating: number;
		avgPrice: number;
		currency: string?;
		reviewCount: number;
		features: Feature[];
	};
	type ReviewWithData = Review & { user: User; place: Place; drink: Drink; features: Feature[] };
}

export {};
