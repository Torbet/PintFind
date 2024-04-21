<script lang="ts">
	import type { PageServerData } from './$types';
	import Review from '$lib/components/Review.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import { getCurrencySymbol } from '$lib/utils';

	export let data: PageServerData;
	let { drink, ratings, latestReviews } = data;
	let { name, style, description, image, abv, ibu, avgRating, avgPrice, reviewCount, currency } =
		drink;
	let currencySymbol = getCurrencySymbol(currency);
</script>

<svelte:head>
	<title>{name} | PintFind</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={name} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="PintFind" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={import.meta.url} />
</svelte:head>

<div class="flex flex-col-reverse gap-6 lg:flex-row">
	<div class="flex flex-1 flex-col gap-4">
		<div>
			<h1 class="text-4xl font-bold">{name}</h1>
			<p class="text-xl text-gray-500">{style.name}</p>
		</div>

		<div class="flex items-center gap-2">
			{#if avgRating}
				<Rating rating={avgRating} size={32} />
			{/if}
			{#if avgPrice}
				<span class="badge badge-outline badge-lg font-semibold text-gray-700"
					>{currencySymbol}{avgPrice.toFixed(2)}</span
				>
			{/if}
			{#if reviewCount}
				<span
					class="badge badge-outline badge-lg flex items-center gap-1 font-semibold text-gray-700"
				>
					<svg
						width="18"
						height="18"
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

		{#if abv || ibu}
			<div class="mx-auto flex w-full max-w-xs justify-around">
				{#if abv}
					<div class="flex flex-col items-center">
						<span class="text-4xl font-bold">{abv}</span>
						<span class="text-gray-500">ABV</span>
					</div>
				{/if}
				{#if ibu}
					<div class="flex flex-col items-center">
						<span class="text-4xl font-bold">{ibu || '?'}</span>
						<span class="text-gray-500">IBU</span>
					</div>
				{/if}
			</div>
		{/if}

		<p>{description}</p>
	</div>
	<img width="auto" height="auto" src={image} alt={name} class="flex-1 rounded-box" />
</div>

<div class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">Ratings & Reviews</h2>

	{#if avgRating}
		<div class="mx-auto flex w-full max-w-2xl items-center justify-between">
			<span class="flex flex-col items-center text-lg lg:flex-row lg:items-end"
				><span class="text-6xl font-bold">{avgRating.toFixed(1)}</span> out of 5</span
			>
			<div class="flex flex-col items-end lg:flex-row-reverse lg:gap-4">
				<div class="flex flex-col">
					{#each ratings as { rating, count }}
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-500">{rating} star</span>
							<progress
								class="progress progress-primary w-56 lg:w-64"
								value={(count / reviewCount) * 100}
								max="100"
							></progress>
						</div>
					{/each}
				</div>
				<span class="text-gray-500">{reviewCount} reviews</span>
			</div>
		</div>
	{:else}
		<p class="text-gray-500">No ratings yet.</p>
	{/if}

	<div class="divider"></div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
		{#each latestReviews as review}
			<Review {review} />
		{/each}
	</div>
</div>
