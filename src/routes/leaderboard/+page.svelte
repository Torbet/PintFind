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
								><path
									d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"
								/><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle
									cx="12"
									cy="17"
									r="5"
								/><path d="M12 18v-2h-.5" /></svg
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
