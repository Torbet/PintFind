<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Login | PintFind</title>
</svelte:head>

<form
	method="post"
	use:enhance
	class="m-auto flex w-full max-w-2xl flex-col gap-4 rounded-box border p-6"
>
	<h2 class="text-2xl font-bold">Login</h2>

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
				d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
			/>
		</svg>
		<input type="email" name="email" placeholder="Email" class="grow" required />
	</label>

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
				d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
		<input type="password" name="password" placeholder="Password" class="grow" required />
	</label>

	<p>Don't have an account? <a href="/signup" class="link">Sign Up</a></p>

	{#if form?.message}
		<div role="alert" class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>Error! {form.message}</span>
		</div>
	{/if}

	<button type="submit" class="btn btn-primary">Login</button>
</form>
