<script lang="ts">
	import Rating from '$lib/components/Rating.svelte';
	import { getCurrencySymbol } from '$lib/utils';

	export let place: PlaceWithData;
	let {
		slug,
		image,
		name,
		street,
		postcode,
		city,
		country,
		avgRating,
		avgPrice,
		reviewCount,
		currency,
		features
	} = place;
	let currencySymbol = getCurrencySymbol(currency || 'GBP');
</script>

<a href="/places/{slug}" data-sveltekit-reload class="grow rounded-box border hover:bg-base-200">
	{#if image}
		<img src={image} alt={name} loading="lazy" class="h-48 w-full rounded-t-box object-cover" />
	{/if}
	<div class="flex flex-col gap-2 p-6">
		{#if avgRating || avgPrice}
			<div class="flex items-center gap-2">
				{#if avgRating}
					<Rating rating={avgRating} size={24} />
				{/if}
				{#if avgPrice}
					<span class="badge badge-outline font-semibold text-gray-700"
						>{currencySymbol}{avgPrice.toFixed(2)}</span
					>
				{/if}
				{#if reviewCount}
					<span class="badge badge-outline flex items-center gap-1 font-semibold text-gray-700">
						<svg
							width="16"
							height="16"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
							/>
						</svg>
						{reviewCount}
					</span>
				{/if}
			</div>
		{/if}
		<div class="flex flex-wrap gap-2">
			{#each features as { name }}
				<span class="badge badge-success badge-outline badge-sm">{name}</span>
			{/each}
		</div>
		<span class="font-bold">{name}</span>
		<span class="text-sm text-gray-500">{street}, {postcode}, {city}, {country}</span>
	</div>
</a>
