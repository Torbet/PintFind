<script lang="ts">
	import type { PageServerData } from './$types';
	import Rating from '$lib/components/Rating.svelte';
	import InteractiveRating from '$lib/components/InteractiveRating.svelte';
	import Review from '$lib/components/Review.svelte';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import { formatDate, getCurrencySymbol } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	export let data: PageServerData & { user: User | null };
	let { user, features, ratings, latestReviews, menu, userReview, relatedPlaces, MAPBOX_TOKEN } =
		data;
	$: ({ place } = data);
	$: ({
		name,
		street,
		postcode,
		city,
		country,
		image,
		avgRating,
		avgPrice,
		currency,
		reviewCount,
		phone,
		website,
		twitter,
		instagram,
		facebook,
		openingHours
	} = place);
	let currencySymbol = getCurrencySymbol(currency || 'GBP');

	let map: mapboxgl.Map;
	let mapContainer: HTMLDivElement;

	onMount(() => {
		if (map) return;
		mapboxgl.accessToken = MAPBOX_TOKEN;
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [place.longitude, place.latitude],
			zoom: 15
		});

		new mapboxgl.Marker({ color: '#5356FF' })
			.setLngLat([place.longitude, place.latitude])
			.addTo(map);
	});

	let rating: number | null = null;
	$: if (rating) {
		if (!user) {
			goto('/login');
		} else {
			fetch('/api/rating', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ placeId: place.id, rating })
			});
			userReview = { rating, createdAt: new Date() };
		}
	}
</script>

<svelte:head>
	<title>{name} | PintFind</title>
	<meta
		name="description"
		content="{name} is a bar in {city}, {country} with {features.map((f) => f.name).join(', ')}"
	/>
	<meta property="og:title" content={name} />
	<meta
		property="og:description"
		content="{name} is a bar in {city}, {country} with {features.map((f) => f.name).join(', ')}"
	/>
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
			<p class="text-xl text-gray-500">{street}, {postcode} {city}, {country}</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each features as { name }}
				<span class="badge badge-success badge-outline badge-lg">{name}</span>
			{/each}
		</div>
		{#if phone || website}
			<div class="flex flex-col gap-2">
				{#if phone}
					<a href="tel:{phone}" class="btn btn-outline btn-primary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
							/></svg
						>
						Call ({phone})
					</a>
				{/if}

				{#if website}
					<a href={website} target="_blank" rel="noopener" class="btn btn-outline btn-primary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="10" /><path
								d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
							/><path d="M2 12h20" /></svg
						>
						Website ({new URL(website).hostname})
					</a>
				{/if}
			</div>
		{/if}
		{#if instagram || facebook || twitter}
			<div class="flex gap-2">
				{#if instagram}
					<a href="https://instagram.com/${instagram}" class="btn btn-outline btn-primary flex-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path
								d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
							/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg
						>
						<span class="hidden lg:block">{instagram}</span>
					</a>
				{/if}

				{#if facebook}
					<a href="https://facebook.com/${facebook}" class="btn btn-outline btn-primary flex-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg
						>
						<span class="hidden lg:block">{facebook}</span>
					</a>
				{/if}

				{#if twitter}
					<a href="https://twitter.com/{twitter}" class="btn btn-outline btn-primary flex-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
							/></svg
						>
						<span class="hidden lg:block">{twitter}</span>
					</a>
				{/if}
			</div>
		{/if}
		{#if openingHours}
			<div class="collapse collapse-arrow rounded-btn border border-primary">
				<input type="checkbox" />
				<div class="collapse-title flex items-center gap-2 font-medium text-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
					>
					Opening Hours
				</div>
				<div class="collapse-content">
					{#each openingHours as { day, hours }}
						<div class="flex justify-between">
							<span class="font-bold">{day}</span>
							<span>{hours}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	{#if image}
		<img
			width="auto"
			height="auto"
			src={image}
			alt={name}
			class="w-full flex-1 rounded-box lg:w-1/2"
		/>
	{/if}
</div>

<div class="divider"></div>

<div bind:this={mapContainer} class="h-56 w-full rounded-box lg:h-96" />

<div class="divider"></div>

<section class=" container flex flex-col gap-4">
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

	<div class="mx-auto flex flex-col items-center gap-2">
		{#if userReview}
			<div class="mx-auto flex flex-col items-center">
				<Rating bind:rating={userReview.rating} size={48} />
				<span class="text-gray-500">Left {formatDate(userReview.createdAt)}</span>
			</div>
		{:else}
			<span class="text-gray-500">Tap to rate:</span>
			<InteractiveRating bind:rating size={48} />
			<a href="/review?placeId={place.id}" class="btn btn-ghost">
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
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
				Write a Review
			</a>
		{/if}
	</div>

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

<div class="divider"></div>

<section class=" container flex flex-col gap-4">
	<h2 class="text-xl font-bold">Menu</h2>

	<div class="overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Pint</th>
					<th>Rating</th>
					<th>Price</th>
					<th>Reviews</th>
				</tr>
			</thead>
			<tbody>
				{#each menu as { name, avgPrice, avgRating, reviewCount, slug }}
					<tr on:click={() => goto(`/drinks/${slug}`)} class="hover cursor-pointer">
						<td class="font-bold">{name}</td>
						<td><Rating rating={avgRating} size={20} /></td>
						<td>{currencySymbol}{avgPrice.toFixed(2)}</td>
						<td>{reviewCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<div class="divider"></div>

<section class=" container flex flex-col gap-4">
	<h2 class="text-xl font-bold">Related Places</h2>

	<div
		class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
	>
		{#each relatedPlaces as place (place.id)}
			<div class="carousel-item w-[95%] md:w-full">
				<PlaceCard {place} />
			</div>
		{/each}
	</div>
</section>
