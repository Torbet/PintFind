<script lang="ts">
	export let drink: DrinkWithStyle | null = null;

	let query: string | null = null;
	let results: DrinkWithStyle[] = [];

	const search = async () => {
		if (!query || query.length < 3) return;

		const response = await fetch(`/api/drinks?q=${query}`);
		results = await response.json();
	};

	const select = (result: DrinkWithStyle | null) => {
		drink = result;
		results = [];
		query = null;
	};
</script>

<label class="input input-bordered flex items-center gap-2">
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
	<input
		type="text"
		bind:value={query}
		on:input={search}
		placeholder="Search drinks..."
		class="grow"
	/>
</label>

{#if (query && query.length > 3) || drink}
	<ul class="menu">
		{#if drink}
			<li>
				<button on:click={() => select(null)} class="active flex flex-col items-start">
					<span class="font-bold">{drink.name}</span>
					<span class="text-sm text-gray-500">{drink.style.name}</span>
				</button>
			</li>
		{:else}
			{#each results as result}
				<li>
					<button on:click={() => select(result)} class="flex flex-col items-start">
						<span class="font-bold">{result.name}</span>
						<span class="text-sm text-gray-500">{result.style.name}</span>
					</button>
				</li>
			{/each}

			<li>
				<a href="/drinks/new" class="font-bold text-primary">
					Add a new drink
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
					>
				</a>
			</li>
		{/if}
	</ul>
{/if}
