<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Sign Up | PintFind</title>
</svelte:head>

<form
	method="post"
	use:enhance
	class="m-auto flex w-full max-w-2xl flex-col gap-4 rounded-box border p-6"
>
	<h2 class="text-2xl font-bold">Sign Up</h2>

	<label class="input input-bordered flex items-center gap-2">
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
			class="opacity-60"
			><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg
		>
		<input type="text" name="username" placeholder="Username" class="grow" required />
	</label>

	<label class="input input-bordered flex items-center gap-2">
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
			class="opacity-60"
			><rect width="20" height="16" x="2" y="4" rx="2" /><path
				d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
			/></svg
		>
		<input type="email" name="email" placeholder="Email" class="grow" required />
	</label>

	<label class="input input-bordered flex items-center gap-2">
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
			class="opacity-60"
			><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
				d="M7 11V7a5 5 0 0 1 10 0v4"
			/></svg
		>
		<input type="password" name="password" placeholder="Password" class="grow" required />
	</label>

	<label class="input input-bordered flex items-center gap-2">
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
			class="opacity-60"
			><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
				d="M7 11V7a5 5 0 0 1 10 0v4"
			/></svg
		>
		<input
			type="password"
			name="confirmPassword"
			placeholder="Confirm Password"
			class="grow"
			required
		/>
	</label>

	<p>Already have an account? <a href="/login" class="link">Login</a></p>

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

	<button type="submit" class="btn btn-primary">Sign Up</button>
</form>
