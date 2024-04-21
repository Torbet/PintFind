import type { RequestHandler } from './$types';
import { MAPBOX_TOKEN } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { places } from '$lib/schema';
import { sql, or } from 'drizzle-orm';
import { slugify } from '$lib/utils';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = locals;
	if (!user) return error(403, 'Forbidden');

	const query = url.searchParams.get('q');
	if (!query) return error(400, 'Bad Request');
	const likeQuery = `%${query.replace(/\s+/g, '%')}%`;

	const existingResults = await db
		.select()
		.from(places)
		.where(
			or(
				sql`REPLACE(${places.name}, "'", "") LIKE ${likeQuery}`,
				sql`REPLACE(${places.street}, "'", "") LIKE ${likeQuery}`,
				sql`REPLACE(${places.city}, "'", "") LIKE ${likeQuery}`,
				sql`REPLACE(${places.country}, "'", "") LIKE ${likeQuery}`,
				sql`REPLACE(CONCAT(${places.name}, ${places.city}), "'", "") LIKE ${likeQuery}`
			)
		)
		.limit(5);
	if (existingResults.length === 5) return json(existingResults);

	const params = new URLSearchParams({
		q: query,
		access_token: MAPBOX_TOKEN,
		types: 'poi',
		poi_category: 'bar,pub,gastropub,restaurant,hotel,hotel_bar,social_club,nightclub',
		limit: String(5 - existingResults.length)
	});

	const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/forward?${params}`);
	if (!response.ok) return error(response.status, response.statusText);
	const { features } = await response.json();

	const results = features
		.map((feature: any) => {
			const { properties } = feature;
			const { name, mapbox_id, context, coordinates, external_ids, metadata } = properties;
			const { address, postcode, place, country } = context;
			if (!address?.name || !postcode?.name || !place?.name || !country?.name) return null;
			const { phone, website, photos, open_hours } = metadata;

			return {
				name,
				slug: slugify(name, place.name, postcode.name),
				mapboxId: mapbox_id,
				street: address?.name,
				postcode: postcode?.name,
				city: place?.name,
				country: country?.name,
				latitude: coordinates.latitude,
				longitude: coordinates.longitude,
				phone,
				website,
				image: photos?.[photos?.length - 2].url,
				externalIds: external_ids,
				openingHours: formatOpeningHours(open_hours?.periods)
			};
		})
		.filter(Boolean);

	if (results.length === 0) return json(existingResults);

	const newResults = await db.insert(places).values(results).onConflictDoNothing().returning();

	return json(newResults.concat(existingResults).filter((r) => r.id));
};

type Period = { open: { day: number; time: string }; close: { day: number; time: string } };
const formatOpeningHours = (periods: Period[] | null) => {
	if (!periods) return null;
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return daysOfWeek.map((day, i) => {
		const days = periods.filter((period) => period.open.day === i);
		switch (days.length) {
			case 0:
				return { day, hours: 'Closed' };
			case 1:
				return { day, hours: formatHours(days[0].open.time, days[0].close.time) };
			case 2:
				return { day, hours: formatHours(days[1].open.time, days[0].close.time) };
		}
	});
};

const formatHours = (open: string, close: string) => {
	const format = (hours: string) => {
		const h = parseInt(hours.slice(0, 2));
		const m = hours.slice(2);
		return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
	};

	return `${format(open)} - ${format(close)}`;
};
