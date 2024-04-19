<script lang="ts">
	import type { PageServerData } from './$types';
	import Rating from '$lib/components/Rating.svelte';
	import InteractiveRating from '$lib/components/InteractiveRating.svelte';
	import Review from '$lib/components/Review.svelte';
	import { formatDate, getCurrencySymbol } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	export let data: PageServerData & { user: User | null };
	let { user, features, ratings, latestReviews, menu, userReview, MAPBOX_TOKEN } = data;
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
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							><path
								d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z"
							></path></svg
						>
						Call ({phone})
					</a>
				{/if}

				{#if website}
					<a href={website} target="_blank" rel="noopener" class="btn btn-outline btn-primary">
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							><path
								d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z"
							></path></svg
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
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							><path
								d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"
							></path></svg
						>
						<span class="hidden lg:block">{instagram}</span>
					</a>
				{/if}

				{#if facebook}
					<a href="https://facebook.com/${facebook}" class="btn btn-outline btn-primary flex-1">
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							><path
								d="M13.001 19.9381C16.9473 19.446 20.001 16.0796 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 16.0796 7.05467 19.446 11.001 19.9381V14H9.00098V12H11.001V10.3458C11.001 9.00855 11.1402 8.52362 11.4017 8.03473C11.6631 7.54584 12.0468 7.16216 12.5357 6.9007C12.9184 6.69604 13.3931 6.57252 14.2227 6.51954C14.5519 6.49851 14.9781 6.52533 15.501 6.6V8.5H15.001C14.0837 8.5 13.7052 8.54332 13.4789 8.66433C13.3386 8.73939 13.2404 8.83758 13.1653 8.97793C13.0443 9.20418 13.001 9.42853 13.001 10.3458V12H15.501L15.001 14H13.001V19.9381ZM12.001 22C6.47813 22 2.00098 17.5228 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22Z"
							></path></svg
						>
						<span class="hidden lg:block">{facebook}</span>
					</a>
				{/if}

				{#if twitter}
					<a href="https://twitter.com/{twitter}" class="btn btn-outline btn-primary flex-1">
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							><path
								d="M15.3499 5.55005C13.7681 5.55005 12.4786 6.81809 12.4504 8.39658L12.4223 9.97162C12.4164 10.3029 12.143 10.5667 11.8117 10.5608C11.7881 10.5604 11.7646 10.5586 11.7413 10.5554L10.1805 10.3426C8.12699 10.0625 6.15883 9.11736 4.27072 7.54411C3.67275 10.8538 4.84 13.1472 7.65342 14.916L9.40041 16.0142C9.68095 16.1906 9.7654 16.561 9.58903 16.8415C9.54861 16.9058 9.49636 16.9619 9.43504 17.0067L7.84338 18.1696C8.78973 18.229 9.68938 18.1875 10.435 18.0387C15.1526 17.0973 18.2897 13.547 18.2897 7.69109C18.2897 7.213 17.2774 5.55005 15.3499 5.55005ZM10.4507 8.3609C10.4983 5.69584 12.6735 3.55005 15.3499 3.55005C16.7132 3.55005 17.9465 4.10683 18.8348 5.0054C19.5462 5.00005 20.1514 5.17991 21.5035 4.35967C21.1693 6.00005 21.0034 6.71201 20.2897 7.69109C20.2897 15.3326 15.5926 19.0489 10.8264 20C7.5587 20.6522 2.80646 19.5815 1.44531 18.1587C2.13874 18.1054 4.95928 17.802 6.58895 16.6092C5.20994 15.6987 -0.278631 12.4681 3.32772 3.78642C5.02119 5.76307 6.73797 7.10855 8.47807 7.82286C9.63548 8.29798 9.91978 8.2885 10.4507 8.3609Z"
							></path></svg
						>
						<span class="hidden lg:block">{twitter}</span>
					</a>
				{/if}
			</div>
		{/if}
		{#if openingHours}
			<div class="collapse collapse-arrow rounded-btn border border-primary">
				<input type="checkbox" />
				<div class="collapse-title text-lg font-medium text-primary">Opening Hours</div>
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
	<img
		width="auto"
		height="auto"
		src={image}
		alt={name}
		class="w-full flex-1 rounded-box lg:w-1/2"
	/>
</div>

<div class="divider"></div>

<div bind:this={mapContainer} class="h-56 w-full rounded-box lg:h-96" />

<div class="divider"></div>

<section class="flex flex-col gap-4">
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
			<a href="/review" class="btn btn-ghost">
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

	<div class="carousel carousel-center gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
		{#each latestReviews as review}
			<div class="carousel-item w-5/6 md:w-full">
				<Review {review} />
			</div>
		{/each}
	</div>
</section>

<div class="divider"></div>

<section class="flex flex-col gap-4">
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
						<td>{currencySymbol}{avgPrice}</td>
						<td>{reviewCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
