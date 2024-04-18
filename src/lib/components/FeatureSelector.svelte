<script lang="ts">
	export let features: string[] = [];

	const data = [
		{
			id: 'nxb33cvgmoqq9i3',
			name: 'Board Games',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'dmzdcb27mrxgesr',
			name: 'Smoking Area',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'vw977f1bqcw01sv',
			name: 'Beer Garden',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'b1aq85usb6v156b',
			name: 'Live Music',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'mz76rmpa1ize2z8',
			name: 'Food',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'wg883yjzxw8m773',
			name: 'Pool Tables',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'z1z1z1z1z1z1z1z',
			name: 'Darts',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'y2y2y2y2y2y2y2y',
			name: 'Karaoke',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'x3x3x3x3x3x3x3',
			name: 'Sports TV',
			description: '',
			createdAt: new Date()
		},
		{
			id: 'w4w4w4w4w4w4w4w',
			name: 'WiFi',
			description: '',
			createdAt: new Date()
		}
	];

	const toggleFeature = (feature: Feature) => {
		if (features.includes(feature.id)) {
			features = features.filter((f) => f !== feature.id);
		} else {
			features = [...features, feature.id];
		}
	};
</script>

<div class="flex flex-wrap gap-2">
	{#each data as feature}
		<button
			on:click={() => toggleFeature(feature)}
			class="badge badge-outline badge-lg"
			class:badge-error={!features.includes(feature.id)}
			class:badge-success={features.includes(feature.id)}>{feature.name}</button
		>
	{/each}
</div>
