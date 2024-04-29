<script lang="ts">
	import type { PageServerData } from './$types';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import Review from '$lib/components/Review.svelte';
	import Rating from '$lib/components/Rating.svelte';
	import { kFormatter } from '$lib/utils';

	export let data: PageServerData;
	let { counts, trendingPlaces, latestReviews } = data;
	let { drinkCount, placeCount, reviewCount, userCount } = counts;
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

<section class="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-6 text-center">
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

	<div class="flex flex-col items-center gap-1">
		<div class="avatar-group -space-x-5 py-0 rtl:space-x-reverse">
			<div class="avatar">
				<div class="h-12 w-12">
					<img
						width="48"
						height="48"
						src="https://cdn.pintfind.com/cdn-cgi/image/width=120,format=auto/avatars%2Ffelixhoare-pac_ghost.png"
						alt="felixhoare"
					/>
				</div>
			</div>
			<div class="avatar">
				<div class="h-12 w-12">
					<img
						width="48"
						height="48"
						src="https://cdn.pintfind.com/cdn-cgi/image/width=120,format=auto/avatars%2Fanton-72282406887__EAAD18FB-5483-4243-9D8D-9779C69FBC25.jpeg"
						alt="anton"
					/>
				</div>
			</div>
			<div class="avatar">
				<div class="h-12 w-12">
					<img
						width="48"
						height="48"
						src="https://cdn.pintfind.com/cdn-cgi/image/width=120,format=auto/avatars%2Fabby-pintfind picture.jpg"
						alt="abby"
					/>
				</div>
			</div>
			<div class="avatar">
				<div class="h-12 w-12">
					<img
						width="48"
						height="48"
						src="https://cdn.pintfind.com/cdn-cgi/image/width=120,format=auto/avatars%2Fzea-IMG_6462.jpeg"
						alt="zea"
					/>
				</div>
			</div>
			<div class="avatar">
				<div class="h-12 w-12">
					<img
						width="48"
						height="48"
						src="https://cdn.pintfind.com/cdn-cgi/image/width=120,format=auto/avatars%2Fguy-Picture 026.jpg"
						alt="guy"
					/>
				</div>
			</div>
		</div>

		<Rating rating={5} size={28} />
		<span class="font-semibold text-gray-500"
			>Loved by <span class="font-bold">{userCount}</span> members</span
		>
	</div>
</section>

<section class="grid grid-cols-1 gap-4 md:grid-cols-3">
	<div class="flex flex-col items-center gap-4 rounded-box border p-6 text-center">
		<svg
			width="52"
			height="52"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
			/>
		</svg>
		<h3 class="text-xl font-bold">The Best Bars, Rated by You</h3>
		<p class="text-lg text-gray-600">
			Discover the best bars and pubs in your area - curated by beer lovers for beer lovers.
		</p>
	</div>

	<div class="flex flex-col items-center gap-4 rounded-box border p-6 text-center">
		<svg
			width="52"
			height="52"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
			/>
		</svg>
		<h3 class="text-xl font-bold">Join the Crew</h3>
		<p class="text-lg text-gray-600">
			Share your favorite spots, get recommendations, and make new drinking buddies who love a good
			pint.
		</p>
	</div>

	<div class="flex flex-col items-center gap-4 rounded-box border p-6 text-center">
		<svg
			width="52"
			height="52"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
			/>
		</svg>
		<h3 class="text-xl font-bold">Deals Worth Raising a Glass To</h3>
		<p class="text-lg text-gray-600">
			Get the inside scoop on the latest beer deals and happy hour specials to enjoy great pints at
			great prices.
		</p>
	</div>
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
