<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	let { topUsers } = data;

	const date = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
</script>

<svelte:head>
	<title>Leaderboard | PintFind</title>
	<meta name="description" content="Win a free pint by topping the leaderboard" />
	<meta property="og:title" content="Leaderboard" />
	<meta property="og:description" content="Win a free pint by topping the leaderboard" />
	<meta property="og:image" content="/logo.png" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="PintFind" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={import.meta.url} />
</svelte:head>

<h1 class="text-4xl font-bold">🍻 Top Reviewers - {date}</h1>

<p class="mb-4 text-2xl text-gray-500">Top the leaderboard for a free pint!</p>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Position</th>
				<th>Username</th>
				<th>Reviews</th>
			</tr>
		</thead>
		<tbody>
			{#each topUsers as { username, reviewCount }, i}
				<tr on:click={() => goto(`/users/${username}`)} class="hover cursor-pointer">
					<td class="font-bold">{i + 1}</td>
					<td class="flex items-center gap-2">
						{#if i == 0}
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
								><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path
									d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
								/><path d="M4 22h16" /><path
									d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
								/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path
									d="M18 2H6v7a6 6 0 0 0 12 0V2Z"
								/></svg
							>
						{/if}
						{username}
					</td>
					<td>{reviewCount}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
