import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { drinks, places, reviews } from '$lib/schema';
import { getTableColumns, count, desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async (request) => {
	const placeResults = await db
		.select({ ...getTableColumns(places) })
		.from(places)
		.leftJoin(reviews, eq(places.id, reviews.placeId))
		.groupBy(places.id)
		.orderBy(desc(count(reviews.id)))
		.limit(200);

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${placeResults.map((place) => {
							return `
                    <url>
                        <loc>https://pintfind.com/places/${place.slug}</loc>
						<lastmod>${new Date().toISOString()}</lastmod>
                        <changefreq>monthly</changefreq>
                        <priority>0.8</priority>
                    </url>
                `;
						})}
        </urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
