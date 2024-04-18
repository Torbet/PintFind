<script lang="ts">
	import type { LayoutServerData } from './$types';
	import 'tailwindcss/tailwind.css';
	import { afterNavigate } from '$app/navigation';

	export let data: LayoutServerData;
	$: user = data.user;

	let sidebar: boolean = false;
	afterNavigate(() => (sidebar = false));
</script>

<div class="drawer drawer-end grow">
	<input type="checkbox" id="sidebar" bind:checked={sidebar} class="drawer-toggle" />

	<div class="drawer-content flex flex-col">
		<nav class="navbar">
			<div class="navbar-start">
				<a href="/" class="btn btn-ghost text-xl">
					<svg
						width="28"
						height="28"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						><path
							d="M9 3C10.1046 3 11 3.89543 11 5C11 5.11469 10.9904 5.22639 10.9723 5.33454L12.9447 5.66546C12.9812 5.4484 13 5.22602 13 5C13 4.7625 12.9793 4.52984 12.9396 4.30371C13.2472 4.11088 13.6103 4 14 4C15.1046 4 16 4.89543 16 6C16 6.36443 15.903 6.70571 15.7327 7H5C4.44772 7 4 6.55228 4 6C4 5.44772 4.44772 5 5 5C5.20008 5 5.38362 5.05773 5.53851 5.15709C5.81193 5.33249 6.15353 5.36415 6.45453 5.24199C6.75554 5.11982 6.97845 4.85905 7.05229 4.5427C7.25876 3.65813 8.05374 3 9 3ZM10.5164 1.29745C10.0489 1.10575 9.53693 1 9 1C7.50087 1 6.19573 1.82409 5.51068 3.04344C5.34453 3.01488 5.17387 3 5 3C3.34315 3 2 4.34315 2 6C2 6.8885 2.38625 7.68679 3 8.23611V20C3 21.1046 3.89543 22 5 22H15C16.1046 22 17 21.1046 17 20H19C20.1046 20 21 19.1046 21 18V11C21 9.89543 20.1046 9 19 9H17V8.64575C17.6215 7.94132 18 7.01438 18 6C18 3.79086 16.2091 2 14 2C13.3143 2 12.6684 2.17301 12.1042 2.47716C11.6851 1.96201 11.1402 1.5532 10.5164 1.29745ZM17 11H19V18H17V11ZM15 9V10V19V20H5V9H15ZM7 11V18H9V11H7ZM13 11V18H11V11H13Z"
						></path></svg
					>
					PintFind
				</a>
			</div>
			<ul class="menu navbar-center hidden lg:menu-horizontal">
				<li>
					<a href="/search">
						<svg
							width="24"
							height="24"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>

						Search
					</a>
				</li>
				<li>
					<a href="/review">
						<svg
							width="24"
							height="24"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
							/>
						</svg>
						Review
					</a>
				</li>
			</ul>
			<div class="navbar-end">
				<div class="hidden gap-2 lg:flex">
					{#if user}
						<div class="dropdown dropdown-end">
							<div tabindex="0" role="button" class="avatar placeholder btn btn-circle btn-ghost">
								<div class="w-10 rounded-full bg-neutral text-neutral-content">
									{#if user.avatar}
										<img width="40" height="40" src={user.avatar} alt={user.username} />
									{:else}
										<span class="text-lg">{user.username[0].toUpperCase()}</span>
									{/if}
								</div>
							</div>
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<ul
								tabindex="0"
								class="menu dropdown-content menu-sm z-[1] mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
							>
								<li>
									<a href="/profile" class="justify-between"
										>Profile<span class="badge badge-primary badge-outline">New</span></a
									>
								</li>
								<li><a href="/logout">Logout</a></li>
							</ul>
						</div>
					{:else}
						<a href="/login" class="btn btn-primary">Login</a>
						<a href="/signup" class="btn btn-outline btn-primary">Sign Up</a>
					{/if}
				</div>
				<label for="sidebar" class="btn btn-square btn-ghost lg:hidden">
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						><path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"></path></svg
					>
				</label>
			</div>
		</nav>

		<main class="container mb-6 flex grow flex-col">
			<slot />
		</main>
	</div>

	<div class="drawer-side">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu min-h-full w-80 gap-2 bg-base-200 p-4">
			{#if user}
				<li>
					<a href="/profile" class="flex">
						<div class="avatar placeholder">
							<div class="h-12 w-12 rounded-full bg-neutral text-neutral-content">
								{#if user.avatar}
									<img width="40" height="40" src={user.avatar} alt={user.username} />
								{:else}
									<span class="text-xl font-bold">{user.username[0].toUpperCase()}</span>
								{/if}
							</div>
						</div>
						<div class="flex flex-col">
							<span class="font-bold">{user.username}</span>
							<span class="text-sm text-gray-500">{user.email}</span>
						</div>
					</a>
				</li>
			{:else}
				<li><a href="/login" class="btn btn-primary">Login</a></li>
				<li><a href="/signup" class="btn btn-outline btn-primary">Sign Up</a></li>
			{/if}
			<li>
				<a href="/search">
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>

					Search
				</a>
			</li>
			<li>
				<a href="/review">
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
						/>
					</svg>
					Review
				</a>
			</li>
			{#if user}
				<li class="mt-auto"><a href="/logout" class="btn btn-outline btn-error">Logout</a></li>
			{/if}
		</ul>
	</div>
</div>
