<script lang="ts">
	let style: Style | null = null;
	$: styleId = style?.id || null;
	let styleQuery: string | null = null;
	let styleResults: Style[] = [];

	const search = async () => {
		if (!styleQuery || styleQuery.length < 3) return;

		const response = await fetch(`/api/styles?q=${styleQuery}`);
		styleResults = await response.json();
	};

	const select = (result: Style | null) => {
		style = result;
		styleQuery = result?.name || null;
		styleResults = [];
	};
</script>

<svelte:head>
	<title>New Drink | PintFind</title>
</svelte:head>

<form method="post" class="m-auto flex w-full max-w-2xl flex-col gap-4 rounded-box border p-6">
	<h2 class="text-2xl font-bold">New Drink</h2>

	<input type="text" name="name" placeholder="Name" class="input input-bordered" required />

	<input
		type="text"
		placeholder="Style"
		bind:value={styleQuery}
		on:input={search}
		class="input input-bordered"
		required
	/>

	<input type="hidden" name="styleId" bind:value={styleId} required />

	{#if styleResults.length > 0}
		<ul class="menu">
			{#each styleResults as result}
				<li>
					<button on:click={() => select(result)} class="flex flex-col items-start">
						<span class="font-bold">{result.name}</span>
						<span class="text-sm text-gray-500">{result.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<textarea name="description" placeholder="Description" class="textarea textarea-bordered"
	></textarea>

	<button type="submit" class="btn btn-primary">Add Drink</button>
</form>
