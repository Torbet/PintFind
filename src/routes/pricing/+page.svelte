<script lang="ts">
	let tab: number = 0;
</script>

<svelte:head>
	<title>Pricing | PintFind</title>
</svelte:head>

<div role="tablist" class="tabs-boxed tabs mb-6">
	<button on:click={() => (tab = 0)} role="tab" class="tab" class:tab-active={tab == 0}
		>Users</button
	>
	<button on:click={() => (tab = 1)} role="tab" class="tab" class:tab-active={tab == 1}
		>Businesses</button
	>
</div>

{#if tab === 0}
	<section class="mb-6 flex flex-col gap-4">
		<h2 class="text-4xl font-semibold">Always Free for Beer Lovers</h2>
		<p class="text-lg text-gray-500">
			PintFind is, and always will be, completely free for beer enthusiasts to use.
		</p>
		<p class="text-lg text-gray-500">
			Our mission is to connect passionate beer lovers with the best breweries, pubs, and taprooms,
			without any barriers or costs for our users.
		</p>
		<p class="text-lg text-gray-500">
			Explore, discover, and share your love of craft beer without worrying about fees or
			subscriptions.
		</p>
		<p class="text-lg text-gray-500"></p>
	</section>
{:else if tab == 1}
	<section class="mb-6 flex flex-col gap-4">
		<h1 class="text-4xl font-bold">Reach More Beer Lovers with PintFind</h1>
		<p class="text-lg text-gray-500">
			With powerful listing and review features, our platform puts your establishment in front of
			beer enthusiasts actively searching for their next great pint.
		</p>
	</section>

	<section class="grid gap-4 lg:grid-cols-3">
		<!-- Essential -->
		<div class="flex flex-col gap-4 rounded-box border p-6">
			<h2 class="text-2xl font-bold">Essential</h2>

			<span class="text-lg text-gray-500">Get Found and Attract More Locals</span>

			<div class="flex items-end">
				<span class="text-4xl font-bold">£12.99</span>
				<span class="text-xl font-bold text-gray-600">/month</span>
			</div>

			<ul class="flex flex-col gap-6">
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Add social media links
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Upload photos to showcase your venue
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Share events and promotions
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Select menu highlights
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Add opening hours & contact details
				</li>
			</ul>
			<a href="https://buy.stripe.com/8wM9Edcbv7dl1K8145" class="btn btn-primary mt-auto"
				>Get Started</a
			>
		</div>

		<!-- Boost -->
		<div class="flex flex-col gap-4 rounded-box border border-primary p-6">
			<h2 class="text-2xl font-bold">Boost</h2>

			<span class="text-lg text-gray-500">Stand Out as a Local Hotspot</span>

			<div class="flex items-end">
				<span class="mr-2 text-2xl font-semibold line-through">£39.99</span>
				<span class="text-4xl font-bold text-primary">£24.99</span>
				<span class="text-xl font-bold text-gray-600">/month</span>
			</div>

			<span class="text-lg text-gray-500">Everything in Essential, plus:</span>

			<ul class="flex flex-col gap-6">
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Get recommended in your area
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Verified badge to increase credibility
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Run promotions and offers
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Display booking details
				</li>
			</ul>
			<a href="https://buy.stripe.com/5kA4jTb7reFN4Wk3cc" class="btn btn-primary mt-auto"
				>Get Started</a
			>
		</div>

		<!-- Enterprise -->
		<div class="flex flex-col gap-4 rounded-box border p-6">
			<h2 class="text-2xl font-bold">Enterprise</h2>

			<span class="text-lg text-gray-500">Amplify Your Brand's Reach</span>

			<div class="flex items-end">
				<span class="text-4xl font-bold">Contact Us</span>
			</div>

			<span class="text-lg text-gray-500">Everything in Essential, plus:</span>

			<ul class="flex flex-col gap-6">
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Deals and offers in your customers inbox
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Premium ad placement site-wide
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Personalised marketing campaigns
				</li>
				<li class="flex gap-2">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="green"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Advanced analtics and reporting
				</li>
			</ul>
			<a
				href="mailto:guy@pintfind.com?subject=We Want PintFind Enterprise!"
				target="_blank"
				class="btn btn-primary mt-auto">Get Started</a
			>
		</div>
	</section>
{/if}
