<script lang="ts">
	import type { PageServerData } from './$types';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import Review from '$lib/components/Review.svelte';
	import { kFormatter } from '$lib/utils';

	export let data: PageServerData;
	let { counts, trendingPlaces, latestReviews } = data;
	let { drinkCount, placeCount, reviewCount } = counts;
</script>

<svelte:head>
	<title>Discover the Perfect Pint | PintFind</title>
	<meta name="description" content="Explore, Compare and Enjoy Local Bars & Brews" />
	<meta property="og:title" content="Discover the Perfect Pint" />
	<meta property="og:description" content="Explore, Compare and Enjoy Local Bars & Brews" />
	<meta property="og:image" content="/logo.png" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="PintFind" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={import.meta.url} />
</svelte:head>

<section
	class="mx-auto flex h-full min-h-svh w-full max-w-2xl flex-col items-center justify-center gap-6 text-center"
>
	<h1 class="text-6xl font-semibold tracking-tight">
		Discover the <span
			class="font-bold underline decoration-primary decoration-wavy decoration-8 underline-offset-8"
			>Perfect Pint</span
		>
	</h1>

	<p class="text-3xl font-semibold text-gray-500">Explore, Compare and Enjoy Local Bars & Brews</p>

	<div class="stats">
		<div class="stat">
			<div class="stat-title">Pints</div>
			<div class="stat-value">{kFormatter(drinkCount)}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Pubs & Bars</div>
			<div class="stat-value">{kFormatter(placeCount)}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Reviews</div>
			<div class="stat-value">{kFormatter(reviewCount)}</div>
		</div>
	</div>

	<a href="/search" class="btn btn-primary w-full text-xl">
		Get Started
		<svg
			class="animate-pulse"
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="3"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
			/>
		</svg>
	</a>
</section>

<div class="divider"></div>

<section class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">Trending Places</h2>

	<div
		class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
	>
		{#each trendingPlaces as place}
			<div class="carousel-item w-[95%] md:w-full">
				<PlaceCard {place} />
			</div>
		{/each}
	</div>
</section>

<div class="divider"></div>

<section class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">Latest Reviews</h2>

	<div
		class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
	>
		{#each latestReviews as review}
			<div class="carousel-item w-[95%] md:w-full">
				<Review {review} />
			</div>
		{/each}
	</div>
</section>
