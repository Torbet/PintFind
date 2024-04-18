<script lang="ts">
	export let place: Place | null = null;

	let query: string | null = null;
	let results: Place[] = [];

	const search = async () => {
		if (!query || query.length < 3) return;

		const response = await fetch(`/api/places?q=${query}`);
		results = await response.json();
	};

	const select = (result: Place | null) => {
		place = result;
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
		placeholder="Search bars and pubs..."
		class="grow"
	/>
</label>

{#if results.length > 0 || place}
	<ul class="menu">
		{#if place}
			<li>
				<button on:click={() => select(null)} class="active flex flex-col items-start">
					<span class="font-bold">{place.name}</span>
					<span class="text-sm text-gray-500">{place.street}, {place.city}, {place.country}</span>
				</button>
			</li>
		{:else}
			{#each results as result}
				<li>
					<button on:click={() => select(result)} class="flex flex-col items-start">
						<span class="font-bold">{result.name}</span>
						<span class="text-sm text-gray-500"
							>{result.street}, {result.city}, {result.country}</span
						>
					</button>
				</li>
			{/each}
		{/if}
	</ul>
{/if}
