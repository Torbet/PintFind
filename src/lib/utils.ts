export const slugify = (...args: string[]) => {
	return args
		.join(' ')
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/-+$/, '');
};

export const getCurrencySymbol = (currency: string | null) => {
	switch (currency) {
		case 'USD':
			return '$';
		case 'EUR':
			return '€';
		case 'GBP':
			return '£';
		default:
			return currency;
	}
};

export const formatDate = (date: Date | string) => {
	return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getDaysAgo = (date: Date | string) => {
	const now = new Date();
	const then = new Date(date);
	const diff = now.getTime() - then.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	return days;
};

export const kFormatter = (num: number) => {
	return Math.abs(num) > 999
		? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(2)) + 'k'
		: Math.sign(num) * Math.abs(num);
};
