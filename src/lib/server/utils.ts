import { db } from '$lib/server/db';
import { features, reviews, featuresToReviews } from '$lib/schema';
import { eq, getTableColumns } from 'drizzle-orm';

export const getFeatures = async (placeId: string): Promise<Feature[]> => {
	const results = await db
		.select({
			...getTableColumns(features)
		})
		.from(reviews)
		.where(eq(reviews.placeId, placeId))
		.leftJoin(featuresToReviews, eq(reviews.id, featuresToReviews.reviewId))
		.innerJoin(features, eq(features.id, featuresToReviews.featureId))
		.groupBy(features.id);

	return results;
};
