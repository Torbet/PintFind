<script lang="ts">
	import type { LayoutServerData } from './$types';
	import '$lib/global.css';
	import { afterNavigate } from '$app/navigation';

	export let data: LayoutServerData;
	$: user = data.user;

	let sidebar: boolean = false;
	afterNavigate(() => (sidebar = false));
</script>

<div class="drawer drawer-end grow">
	<input type="checkbox" id="sidebar" bind:checked={sidebar} class="drawer-toggle" />

	<div class="drawer-content flex flex-col">
		<nav class="navbar sticky top-0 z-10 bg-base-100 bg-opacity-85 backdrop-blur">
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
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
						Search
					</a>
				</li>
				<li>
					<a href="/review">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg
						>
						Review
					</a>
				</li>
				<li>
					<a href="/leaderboard">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path
								d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
							/><path d="M4 22h16" /><path
								d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
							/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path
								d="M18 2H6v7a6 6 0 0 0 12 0V2Z"
							/></svg
						>
						Leaderboard
					</a>
				</li>
				<li>
					<a href="/pricing">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-wallet"
							><path
								d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
							/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg
						>
						Pricing
					</a>
				</li>
			</ul>
			<div class="navbar-end">
				<div class="hidden gap-2 lg:flex">
					{#if user}
						<div class="dropdown dropdown-end">
							<div tabindex="0" role="button" class="avatar placeholder btn btn-circle btn-ghost">
								<div class="h-10 w-10 rounded-full bg-neutral text-neutral-content">
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
									<a href="/users/{user.username}" class="justify-between"
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

		<main class="container flex grow flex-col pb-12">
			<slot />
		</main>

		<footer class="footer footer-center rounded p-10">
			<nav class="grid grid-flow-col gap-4">
				<a href="/search" class="link-hover link">Search</a>
				<a href="/review" class="link-hover link">Review</a>
				<a href="/leaderboard" class="link-hover link">Leaderboard</a>
				<a href="/pricing" class="link-hover link">Pricing</a>
			</nav>
			<nav>
				<div class="grid grid-flow-col gap-4">
					<a href="https://twitter.com/guytorbet">
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
								d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
							/></svg
						>
					</a>
					<a href="https://instagram.com/pintfind">
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
							><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path
								d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
							/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg
						>
					</a>
					<a href="https://www.facebook.com/profile.php?id=61552267682546">
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
							class="lucide lucide-facebook"
							><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg
						>
					</a>
				</div>
			</nav>
		</footer>
	</div>

	<div class="drawer-side z-20">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu min-h-full w-80 gap-2 bg-base-200 p-4">
			{#if user}
				<li>
					<a href="/users/{user.username}" class="flex">
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
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
					>
					Search
				</a>
			</li>
			<li>
				<a href="/review">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg
					>
					Review
				</a>
			</li>
			<li>
				<a href="/leaderboard">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path
							d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
						/><path d="M4 22h16" /><path
							d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
						/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path
							d="M18 2H6v7a6 6 0 0 0 12 0V2Z"
						/></svg
					>
					Leaderboard
				</a>
			</li>
			<li>
				<a href="/pricing">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-wallet"
						><path
							d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
						/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg
					>
					Pricing
				</a>
			</li>
			{#if user}
				<li class="mt-auto"><a href="/logout" class="btn btn-outline btn-error">Logout</a></li>
			{/if}
		</ul>
	</div>
</div>
