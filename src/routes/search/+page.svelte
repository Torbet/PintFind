<script lang="ts">
	import type { PageServerData } from './$types';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import InteractiveRating from '$lib/components/InteractiveRating.svelte';
	import FeatureSelector from '$lib/components/FeatureSelector.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getCurrencySymbol } from '$lib/utils';

	export let data: PageServerData;
	const { MAPBOX_TOKEN } = data;
	$: results = data.results;
	$: console.log(results);

	let showFilterModal = false;

	let query: string | null = $page.url.searchParams.get('query') || null;
	let rating: number | null = Number($page.url.searchParams.get('rating')) || null;
	let price: number = Number($page.url.searchParams.get('price')) || 10;
	let features: string[] = $page.url.searchParams.get('features')?.split(',') || [];

	const search = () => {
		query ? $page.url.searchParams.set('query', query) : $page.url.searchParams.delete('query');
		rating && $page.url.searchParams.set('rating', rating.toString());
		price && $page.url.searchParams.set('price', price.toString());
		features.length && $page.url.searchParams.set('features', features.join(','));
		goto($page.url, { invalidateAll: true });
		showFilterModal = false;
	};

	const clear = () => {
		query = null;
		rating = null;
		price = 10;
		features = [];
		goto('/search', { invalidateAll: true });
		showFilterModal = false;
	};

	// Map
	let map: mapboxgl.Map;
	let mapContainer: HTMLDivElement;

	onMount(() => {
		if (map) return;
		mapboxgl.accessToken = MAPBOX_TOKEN;
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-3.188267, 55.953251],
			zoom: 12
		});
	});

	// Interactive Map
	let showPlaceModal = false;
	let selectedPlace: PlaceWithData | null = null;
	let markers: mapboxgl.Marker[] = [];

	$: if (map && results.length > 0) {
		const avgLat = results.reduce((acc, place) => acc + place.latitude, 0) / results.length;
		const avgLng = results.reduce((acc, place) => acc + place.longitude, 0) / results.length;
		map.setCenter([avgLng, avgLat]);

		markers.forEach((marker) => marker.remove());
		markers = results.map((place) => {
			const marker = new mapboxgl.Marker({ color: '#5356FF' })
				.setLngLat([place.longitude, place.latitude])
				.addTo(map);
			marker.getElement().addEventListener('click', () => {
				selectedPlace = place;
				showPlaceModal = true;
			});
			return marker;
		});
	}
</script>

<svelte:head>
	<title>Search | PintFind</title>
</svelte:head>

<section class="mb-4 flex gap-2">
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

	<button on:click={() => (showFilterModal = true)} class="btn btn-outline btn-primary">
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
				d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
			/>
		</svg>
		<span>Filter</span>
	</button>

	<button on:click={search} class="btn btn-primary">
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
				d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
			/>
		</svg>
		<span>Search</span>
	</button>
</section>

<section class="flex grow flex-col gap-4">
	<div
		bind:this={mapContainer}
		class="h-96 w-full rounded-box"
		class:hidden={results.length === 0}
	/>

	{#if results.length > 0}
		<div
			class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:p-0 lg:grid-cols-3"
		>
			{#each results as place (place.id)}
				<div class="carousel-item w-[95%] md:w-full">
					<PlaceCard {place} />
				</div>
			{/each}
		</div>
	{:else}
		<span class="m-auto text-lg text-gray-500">No results found.</span>
	{/if}
</section>

<!-- MODALS -->

<dialog class="modal" class:modal-open={showFilterModal}>
	<div class="modal-box flex flex-col gap-4">
		<h3 class="text-lg font-bold">Filter</h3>

		<InteractiveRating bind:rating center size={56} />

		<div class="flex items-center gap-6">
			<span class="font-semibold text-gray-500">£{price.toFixed(2)}</span>
			<input
				type="range"
				bind:value={price}
				min="0"
				max="10"
				step="0.05"
				class="range range-primary"
			/>
		</div>

		<FeatureSelector bind:features />

		<div class="flex gap-2">
			<button on:click={clear} class="btn btn-outline btn-primary grow">
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
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
					stroke-width="2"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<span>Search</span>
			</button>
		</div>
	</div>
	<button on:click={() => (showFilterModal = false)} class="modal-backdrop"></button>
</dialog>

{#if selectedPlace}
	<dialog class="modal" class:modal-open={showPlaceModal}>
		<div class="modal-box flex flex-col gap-4">
			<h3 class="text-lg font-bold">{selectedPlace.name}</h3>

			<img src={selectedPlace.image} alt={selectedPlace.name} class="rounded-box" />

			<p class="font-semibold text-gray-500">
				{selectedPlace.street}, {selectedPlace.postcode}, {selectedPlace.city}, {selectedPlace.country}
			</p>

			<div class="flex items-center gap-4">
				<Rating rating={selectedPlace.avgPrice} size={32} />
				<span class="badge badge-outline badge-lg">
					{getCurrencySymbol(selectedPlace.currency)}{selectedPlace.avgPrice.toFixed(2)}
				</span>
			</div>

			<div class="flex flex-wrap gap-2">
				{#each selectedPlace.features as feature}
					<span class="badge badge-success badge-outline">{feature.name}</span>
				{/each}
			</div>

			<a href="/places/{selectedPlace.slug}" class="btn btn-primary">
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
						d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
					/>
				</svg>
				Visit
			</a>
		</div>
		<button on:click={() => (showPlaceModal = false)} class="modal-backdrop"></button>
	</dialog>
{/if}
