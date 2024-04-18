<script lang="ts">
	import Rating from '$lib/components/Rating.svelte';
	import { getDaysAgo, getCurrencySymbol, formatDate } from '$lib/utils';

	export let review: ReviewWithData;

	let {
		user,
		place,
		drink,
		rating,
		price,
		currency,
		features,
		comment,
		createdAt,
		studentDiscount
	} = review;
	let daysAgo = getDaysAgo(createdAt);
	let daysAgoString = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
	let currencySymbol = getCurrencySymbol(currency!);
</script>

<a
	href="/places/{place.slug}"
	class="flex grow flex-col gap-2 rounded-box border p-6 hover:bg-base-200"
>
	<div class="flex gap-2">
		<div class="avatar placeholder">
			<div class="h-12 w-12 rounded-full bg-neutral text-neutral-content">
				{#if user.avatar}
					<img src={user.avatar} alt={user.username} width="28" height="28" />
				{:else}
					<span class="text-lg font-semibold">{user.username[0].toUpperCase()}</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col">
			<span class="font-semibold">{user.username}</span>
			<span class="text-sm text-gray-500">Joined {formatDate(user.createdAt)}</span>
		</div>
		<span class="ml-auto text-sm text-gray-500">{daysAgoString}</span>
	</div>
	<p class="line-clamp-1 font-bold">{drink.name} at {place.name}</p>
	<div class="flex items-center gap-2">
		<Rating {rating} size={24} />
		<span class="badge badge-outline text-gray-700">{currencySymbol}{price?.toFixed(2)}</span>
		{#if studentDiscount}
			<span class="badge badge-outline text-gray-700">
				<svg
					width={18}
					height={18}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
					/>
				</svg>
			</span>
		{/if}
	</div>
	<div class="flex flex-wrap gap-2">
		{#each features as feature}
			<span class="badge badge-success badge-outline badge-sm">{feature.name}</span>
		{/each}
	</div>
	{#if comment}
		<p>{comment}</p>
	{/if}
</a>
