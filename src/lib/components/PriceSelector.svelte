<script lang="ts">
	export let price: number | null = null;
	export let currency: string = 'GBP';

	$: if (price) {
		if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(price.toString())) {
			price = parseFloat(price.toString().slice(0, -1)) || null;
		}
	}
</script>

<div class="join">
	<select bind:value={currency} class="join-item select select-bordered bg-base-200">
		<option value="GBP">£ GBP</option>
		<option value="EUR">€ EUR</option>
		<option value="USD">$ USD</option>
	</select>
	<input
		type="text"
		placeholder="Price"
		inputmode="decimal"
		bind:value={price}
		class="input join-item input-bordered grow"
	/>
</div>
