<script lang="ts">
	import type { PageServerData } from './$types';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import InteractiveRating from '$lib/components/InteractiveRating.svelte';
	import FeatureSelector from '$lib/components/FeatureSelector.svelte';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getCurrencySymbol } from '$lib/utils';

	export let data: PageServerData;
	let { MAPBOX_TOKEN } = data;
	$: ({ results, center } = data);

	let query: string | null = $page.url.searchParams.get('q') || null;
	let rating: number | null = Number($page.url.searchParams.get('r')) || null;
	let price: number = Number($page.url.searchParams.get('p')) || 10;
	let features: string[] = [];

	let showFilterModal: boolean = false;
	let showSelectedPlaceModal: boolean = false;
	let selectedPlace: PlaceWithData | null = null;

	const search = async () => {
		const params = new URLSearchParams();
		if (query) params.set('q', query);
		if (rating) params.set('r', rating.toString());
		if (price) params.set('p', price.toString());
		if (features.length) params.set('f', features.join(','));
		showFilterModal = false;
		goto(`/search?${params.toString()}`);
	};

	const clearFilters = () => {
		query = null;
		rating = null;
		price = 10;
		features = [];
		showFilterModal = false;
		goto('/search');
	};

	let map: mapboxgl.Map;
	let markers: mapboxgl.Marker[] = [];
	let mapContainer: HTMLDivElement;

	onMount(() => {
		if (map || !mapContainer) return;
		mapboxgl.accessToken = MAPBOX_TOKEN;
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-3.188267, 55.953251],
			zoom: 12
		});
	});

	$: if (browser && map && results) {
		map.setCenter(center);
		markers.forEach((marker) => marker.remove());
		markers = results.map((place) => {
			const marker = new mapboxgl.Marker({ color: '#5356FF' })
				.setLngLat([place.longitude, place.latitude])
				.addTo(map);
			marker.getElement().addEventListener('click', () => {
				selectedPlace = place;
				showSelectedPlaceModal = true;
			});
			return marker;
		});
	}
</script>

<svelte:head>
	<title>Search | PintFind</title>
</svelte:head>

<div class="mb-4 flex flex-wrap gap-2">
	<label class="input input-bordered flex grow items-center gap-2">
		<svg
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="opacity-70"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
			/>
		</svg>
		<input type="text" bind:value={query} placeholder="Search pubs & cities..." class="grow" />
	</label>

	<button on:click={() => (showFilterModal = true)} class="btn btn-outline btn-primary text-lg">
		<svg
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
			/>
		</svg>
		<span class="hidden lg:block">Filter</span>
	</button>

	<button on:click={search} class="btn btn-primary text-lg">
		<svg
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
			/>
		</svg>
		<span class="hidden lg:block">Search</span>
	</button>
</div>

<section class="flex grow flex-col gap-4">
	{#if results.length === 0}
		<span class="m-auto text-lg text-gray-500">No results found.</span>
	{:else}
		<p class="text-xs text-gray-500">Tap a place to see information.</p>

		<div bind:this={mapContainer} class="h-56 w-full rounded-box lg:h-96" />

		<div
			class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
		>
			{#each results as place (place.id)}
				<div class="carousel-item w-[95%] md:w-full">
					<PlaceCard {place} />
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- MODALS -->

<dialog class="modal" class:modal-open={showFilterModal}>
	<div class="modal-box flex flex-col gap-6">
		<h3 class="text-lg font-bold">Filter Results</h3>

		<InteractiveRating bind:rating center size={52} />

		<div class="flex items-center gap-4">
			<span class="text-lg font-bold">
				£{price.toFixed(2)}
			</span>
			<input
				type="range"
				min="0"
				step="0.05"
				max="10"
				bind:value={price}
				class="range range-primary"
			/>
		</div>

		<FeatureSelector bind:features />

		<div class="flex gap-2">
			<button on:click={clearFilters} class="btn btn-outline btn-primary grow">
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
				Clear
			</button>

			<button on:click={search} class="btn btn-primary grow">
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				Search
			</button>
		</div>
	</div>
	<button class="modal-backdrop" on:click={() => (showFilterModal = false)} />
</dialog>

{#if selectedPlace}
	<dialog class="modal" class:modal-open={showSelectedPlaceModal}>
		<div class="modal-box flex flex-col gap-2">
			<h3 class="text-lg font-bold">{selectedPlace.name}</h3>
			<p class="text-gray-500">
				{selectedPlace.street}, {selectedPlace.postcode}, {selectedPlace.city}, {selectedPlace.country}
			</p>

			{#if selectedPlace.image}
				<img
					src={selectedPlace.image}
					alt={selectedPlace.name}
					width="auto"
					height="auto"
					class="rounded-box"
				/>
			{/if}

			<div class="flex items-center gap-2">
				{#if selectedPlace.avgRating}
					<Rating rating={selectedPlace.avgRating} size={32} />
				{/if}

				{#if selectedPlace.avgPrice && selectedPlace.currency}
					<span class="badge badge-outline badge-lg"
						>{getCurrencySymbol(selectedPlace.currency)}{selectedPlace.avgPrice.toFixed(2)}</span
					>
				{/if}
			</div>

			<div class="flex gap-2">
				<button
					on:click={() => {
						selectedPlace = null;
						showSelectedPlaceModal = false;
					}}
					class="btn btn-outline btn-primary grow"
				>
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
					Close
				</button>

				<a href="/places/{selectedPlace.slug}" class="btn btn-primary grow">
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
						/>
					</svg>
					Visit
				</a>
			</div>
		</div>
		<button class="modal-backdrop" on:click={() => (showSelectedPlaceModal = false)} />
	</dialog>
{/if}
