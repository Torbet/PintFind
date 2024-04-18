import reviewsData from './data/reviews.json';
import featuresToReviewsData from './data/features_to_reviews.json';
import { db } from './lib/db';
import { reviews, featuresToReviews } from '../src/lib/schema';

const main = async () => {
	reviewsData.map(async (review) => {
		let { created_at, user_id, ...rest } = review;
		let createdAt = new Date(created_at);
		let ftors = featuresToReviewsData
			.filter((ftor) => ftor.review_id === review.id)
			.map((ftor) => ({ featureId: ftor.feature_id, reviewId: ftor.review_id }));
		await db
			.insert(reviews)
			.values({ ...rest, createdAt, userId: user_id })
			.onConflictDoNothing();
		if (ftors.length === 0) return;
		await db.insert(featuresToReviews).values(ftors).onConflictDoNothing();
	});
};

main()
	.then(() => console.log('Done'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
