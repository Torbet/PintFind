<script lang="ts">
	import type { PageServerData } from './$types';
	import Review from '$lib/components/Review.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import { formatDate, getCurrencySymbol } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	const { user, latestReviews, favouritePlaces, favouriteDrinks } = data;
	const { username, avatar, createdAt, reviewCount } = user;
</script>

<svelte:head>
	<title>{username} | PintFind</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<div class="mx-auto flex items-center gap-6">
		<div class="avatar placeholder">
			<div class="h-24 w-24 rounded-full bg-neutral text-neutral-content">
				{#if avatar}
					<img src={avatar} alt={username} width="40" height="40" />
				{:else}
					<span class="text-3xl font-semibold">{username[0].toUpperCase()}</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<span class="text-3xl font-bold">{username}</span>
			<span class="badge badge-outline badge-lg text-xl text-gray-500">{reviewCount} reviews</span>
			<span class="text-gl text-gray-500">Joined {formatDate(createdAt)}</span>
		</div>
	</div>
</section>

<div class="divider"></div>

<section class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">Latest Reviews</h2>

	{#if latestReviews.length === 0}
		<p class="text-center font-semibold text-gray-500">No reviews yet</p>
	{:else}
		<div
			class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
		>
			{#each latestReviews as review}
				<div class="carousel-item w-[95%] md:w-full">
					<Review {review} />
				</div>
			{/each}
		</div>
	{/if}
</section>

<div class="divider"></div>

<section class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">Favourite Places</h2>

	{#if favouritePlaces.length === 0}
		<p class="text-center font-semibold text-gray-500">No favourite places yet</p>
	{:else}
		<div
			class="bleed carousel carousel-center gap-4 px-4 md:m-0 md:grid md:grid-cols-2 md:pl-0 lg:grid-cols-3"
		>
			{#each favouritePlaces as place}
				<div class="carousel-item w-[95%] md:w-full">
					<PlaceCard {place} />
				</div>
			{/each}
		</div>
	{/if}
</section>

<div class="divider"></div>

<section class=" container flex flex-col gap-4">
	<h2 class="text-xl font-bold">Favourite Drinks</h2>

	{#if favouriteDrinks.length === 0}
		<p class="text-center font-semibold text-gray-500">No favourite drinks yet</p>
	{:else}
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
					{#each favouriteDrinks as { name, avgPrice, avgRating, reviewCount, slug, currency }}
						<tr on:click={() => goto(`/drinks/${slug}`)} class="hover cursor-pointer">
							<td class="font-bold">{name}</td>
							<td><Rating rating={avgRating} size={20} /></td>
							<td>{getCurrencySymbol(currency)}{avgPrice.toFixed(2)}</td>
							<td>{reviewCount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
