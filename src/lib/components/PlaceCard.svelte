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
					<Rating rating={avgRating} size={26} />
				{/if}
				{#if avgPrice}
					<span class="badge badge-outline font-semibold"
						>{currencySymbol}{avgPrice.toFixed(2)}</span
					>
				{/if}
				{#if reviewCount}
					<span class="badge badge-outline flex items-center gap-1 font-semibold">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg
						>
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
