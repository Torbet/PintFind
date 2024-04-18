<script lang="ts">
	import PlaceSelector from '$lib/components/PlaceSelector.svelte';
	import DrinkSelector from '$lib/components/DrinkSelector.svelte';
	import InteractiveRating from '$lib/components/InteractiveRating.svelte';
	import PriceSelector from '$lib/components/PriceSelector.svelte';
	import FeatureSelector from '$lib/components/FeatureSelector.svelte';
	import { goto } from '$app/navigation';

	const steps = ['Place', 'Drink', 'Review'];
	let step: number = 0;

	let place: Place | null = null;
	let drink: DrinkWithStyle | null = null;
	let rating: number | null = null;
	let price: number | null = null;
	let currency: string = 'GBP';
	let features: string[] = [];
	let studentDiscount: boolean = false;
	let comment: string | null = null;

	$: {
		steps[0] = place ? place.name : 'Place';
		steps[1] = drink ? drink.name : 'Drink';
	}

	const submit = async () => {
		if (!place || !drink || !rating || !price) return;
		await fetch('/api/reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				placeId: place.id,
				drinkId: drink.id,
				rating,
				price,
				currency,
				studentDiscount,
				comment,
				featureIds: features
			})
		});

		goto(`places/${place.slug}`);
	};
</script>

<svelte:head>
	<title>Review | PintFind</title>
</svelte:head>

<div class="m-auto flex w-full max-w-2xl flex-col gap-4 rounded-box border p-6">
	<h2 class="text-2xl font-bold">Review</h2>

	<ul class="steps z-0">
		{#each steps as s, i}
			<li class="step" class:step-primary={i <= step}>{s}</li>
		{/each}
	</ul>

	{#if step === 0}
		<PlaceSelector bind:place />

		<div class="flex gap-2">
			<button on:click={() => step++} disabled={!place} class="btn btn-primary grow">Next</button>
		</div>
	{:else if step === 1}
		<DrinkSelector bind:drink />

		<div class="flex gap-2">
			<button on:click={() => step--} class="btn btn-outline btn-primary grow">Back</button>
			<button on:click={() => step++} disabled={!drink} class="btn btn-primary grow">Next</button>
		</div>
	{:else if step === 2}
		<InteractiveRating bind:rating center />

		<PriceSelector bind:price bind:currency />

		<FeatureSelector bind:features />

		<label class="label cursor-pointer">
			<span class="label-text">Student Discount</span>
			<input type="checkbox" bind:checked={studentDiscount} class="toggle toggle-primary" />
		</label>

		<textarea
			placeholder="Additional Comments..."
			bind:value={comment}
			class="textarea textarea-bordered"
			required
		></textarea>

		<div class="flex gap-2">
			<button on:click={() => step--} class="btn btn-outline btn-primary grow">Back</button>
			<button
				on:click={submit}
				disabled={!rating || !price || !comment}
				class="btn btn-primary grow">Submit</button
			>
		</div>
	{/if}
</div>
