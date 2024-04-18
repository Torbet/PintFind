import { CF_ACCOUNT_ID, CF_ACCESS_KEY, CF_ACCESS_KEY_SECRET } from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

export const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: CF_ACCESS_KEY,
		secretAccessKey: CF_ACCESS_KEY_SECRET
	}
});
