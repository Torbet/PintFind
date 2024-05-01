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
					<td>{username}</td>
					<td>{reviewCount}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
