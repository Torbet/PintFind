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
	<a href="/users/{user.username}" class="flex gap-2">
		<div class="avatar placeholder">
			<div class="h-12 w-12 rounded-full bg-neutral text-neutral-content">
				{#if user.avatar}
					<img src={user.avatar} alt={user.username} width="28" height="28" loading="lazy" />
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
	</a>
	<p class="line-clamp-1 font-bold">{drink.name} at {place.name}</p>
	<div class="flex items-center gap-2">
		<Rating {rating} size={26} />
		<span class="badge badge-outline font-semibold">{currencySymbol}{price?.toFixed(2)}</span>
		{#if studentDiscount}
			<span class="badge badge-outline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
					/><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg
				>
			</span>
		{/if}
	</div>
	<div class="flex flex-wrap gap-2">
		{#each features as feature}
			<span class="badge badge-success badge-outline badge-sm">{feature.name}</span>
		{/each}
	</div>
	{#if comment}
		<p class="line-clamp-2">{comment}</p>
	{/if}
</a>
