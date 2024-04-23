import { sqliteTable, text, integer, real, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { generateId } from 'lucia';

const createId = () => generateId(15);

export const users = sqliteTable('users', {
	id: text('id').primaryKey().$defaultFn(createId),

	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	avatar: text('avatar'),
	bio: text('bio'),

	hashedPassword: text('hashed_password'),

	paying: integer('paying', { mode: 'boolean' }).default(false),
	unsubscribed: integer('unsubscribed', { mode: 'boolean' }).default(false),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});

export const places = sqliteTable(
	'places',
	{
		id: text('id').primaryKey().$defaultFn(createId),
		slug: text('slug').notNull().unique(),

		name: text('name').notNull(),
		image: text('image'),
		description: text('description'),

		latitude: real('latitude').notNull(),
		longitude: real('longitude').notNull(),
		street: text('street').notNull(),
		postcode: text('postcode').notNull(),
		city: text('city').notNull(),
		country: text('country').notNull(),

		phone: text('phone'),
		website: text('website'),
		facebook: text('facebook'),
		twitter: text('twitter'),
		instagram: text('instagram'),

		openingHours: text('opening_hours', { mode: 'json' }).$type<{ day: string; hours: string }[]>(),
		externalIds: text('external_ids', { mode: 'json' }),

		paying: integer('paying', { mode: 'boolean' }).default(false),
		mapboxId: text('mapbox_id').notNull().unique(),
		userId: text('user_id').references(() => users.id),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(strftime('%s', 'now'))`)
	},
	(t) => ({
		nameIdx: index('places_name_idx').on(t.name),
		cityIdx: index('places_city_idx').on(t.city)
	})
);

export const drinks = sqliteTable(
	'drinks',
	{
		id: text('id').primaryKey().$defaultFn(createId),
		slug: text('slug').notNull().unique(),
		paying: integer('paying', { mode: 'boolean' }).default(false),

		name: text('name').notNull(),
		description: text('description'),
		image: text('image'),

		abv: real('abv'),
		ibu: real('ibu'),
		glass: text('glass'),
		servingTemperature: text('serving_temperature'),
		foodPairings: text('food_pairings'),

		styleId: text('style_id')
			.notNull()
			.references(() => styles.id),

		userId: text('user_id').references(() => users.id),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(strftime('%s', 'now'))`)
	},
	(t) => ({
		nameIdx: index('drinks_name_idx').on(t.name)
	})
);

export const styles = sqliteTable('styles', {
	id: text('id').primaryKey().$defaultFn(createId),
	slug: text('slug').notNull().unique(),

	name: text('name').notNull(),
	shortName: text('short_name').notNull(),
	description: text('description').notNull(),
	category: text('category').notNull(),

	abvMin: real('abv_min'),
	abvMax: real('abv_max'),
	ibuMin: real('ibu_min'),
	ibuMax: real('ibu_max'),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const reviews = sqliteTable('reviews', {
	id: text('id').primaryKey().$defaultFn(createId),

	rating: integer('rating').notNull(),
	price: real('price'),
	currency: text('currency'),
	studentDiscount: integer('student_discount', { mode: 'boolean' }),
	comment: text('comment'),

	placeId: text('place_id')
		.notNull()
		.references(() => places.id),
	drinkId: text('drinks_id').references(() => drinks.id),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const features = sqliteTable('features', {
	id: text('id').primaryKey().$defaultFn(createId),

	name: text('name').notNull(),
	description: text('description').notNull(),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const featuresToReviews = sqliteTable(
	'features_to_reviews',
	{
		featureId: text('feature_id')
			.notNull()
			.references(() => features.id),
		reviewId: text('review_id')
			.notNull()
			.references(() => reviews.id)
	},
	(t) => ({ pk: primaryKey({ columns: [t.featureId, t.reviewId] }) })
);

// === RELATIONS ===

export const userRelations = relations(users, ({ one, many }) => ({
	reviews: many(reviews)
}));

export const placeRelations = relations(places, ({ one, many }) => ({
	reviews: many(reviews)
}));

export const drinkRelations = relations(drinks, ({ one, many }) => ({
	style: one(styles, { fields: [drinks.styleId], references: [styles.id] }),
	reviews: many(reviews)
}));

export const reviewRelations = relations(reviews, ({ one, many }) => ({
	place: one(places, { fields: [reviews.placeId], references: [places.id] }),
	drink: one(drinks, { fields: [reviews.drinkId], references: [drinks.id] }),
	user: one(users, { fields: [reviews.userId], references: [users.id] }),
	featuresToReviews: many(featuresToReviews)
}));

export const featureRelations = relations(features, ({ one, many }) => ({
	featuresToReviews: many(featuresToReviews)
}));

export const featureToReviewRelations = relations(featuresToReviews, ({ one, many }) => ({
	feature: one(features, { fields: [featuresToReviews.featureId], references: [features.id] }),
	review: one(reviews, { fields: [featuresToReviews.reviewId], references: [reviews.id] })
}));
