<script lang="ts">
	import type { PageServerData } from './$types';
	import Review from '$lib/components/Review.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import { formatDate, getCurrencySymbol } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	const { user, latestReviews, favouritePlaces, favouriteDrinks, canEdit } = data;
	const { username, avatar, createdAt, reviewCount, verified } = user;

	const levels = [1, 5, 10, 20, 30, 40, 50];
	const level = levels.find((l) => reviewCount < l) || 0;
	const progress = (reviewCount / level) * 100;
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
		<div class:text-primary={verified} class="flex flex-col gap-1">
			<span class="flex items-center gap-1 text-3xl font-bold">
				{username}
				{#if verified}
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
							d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
						/><path d="m9 12 2 2 4-4" /></svg
					>
				{/if}
			</span>
			<span class="badge badge-outline badge-lg text-xl text-gray-500">{reviewCount} reviews</span>
			<span class="text-gl text-gray-500">Joined {formatDate(createdAt)}</span>
		</div>
	</div>
	<div class="mx-auto flex w-full items-center gap-2 lg:max-w-2xl">
		<span class="bage-lg badge badge-primary badge-outline badge-lg whitespace-nowrap font-semibold"
			>Level {levels.indexOf(level)}</span
		>
		<progress class="progress progress-primary h-4" value={progress} max="100"></progress>
	</div>
	{#if canEdit}
		<a href="/users/{username}/edit" class="btn btn-outline btn-primary">
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
				><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path
					d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"
				/></svg
			>
			Edit Profile</a
		>
	{/if}
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
