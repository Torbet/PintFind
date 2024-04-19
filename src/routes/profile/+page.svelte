<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	export let data: PageServerData;
	let { user } = data;
	let { avatar, username, email } = user;

	let files: FileList;
	$: avatar = files ? URL.createObjectURL(files[0]) : avatar;
</script>

<svelte:head>
	<title>Profile | PintFind</title>
</svelte:head>

<form
	method="post"
	enctype="multipart/form-data"
	use:enhance
	class="m-auto flex w-full max-w-2xl flex-col gap-4 rounded-box border p-6"
>
	<h2 class="text-2xl font-bold">Profile</h2>

	<div class="mx-auto flex items-center gap-2">
		<div class="avatar placeholder">
			<div class="h-20 w-20 rounded-full bg-neutral text-neutral-content">
				{#if avatar}
					<img src={avatar} alt={username} width="40" height="40" />
				{:else}
					<span class="text-2xl font-semibold">{username[0].toUpperCase()}</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<label class="btn btn-primary btn-sm">
				Change Avatar
				<input type="file" name="avatar" bind:files accept="image/*" class="hidden" />
			</label>
			<button class="btn btn-outline btn-error btn-sm">Remove Avatar</button>
		</div>
	</div>

	<label class="input input-bordered input-disabled flex items-center gap-2">
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
				d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
			/>
		</svg>
		<input
			type="text"
			name="username"
			bind:value={username}
			placeholder="Username"
			class="grow"
			disabled
		/>
	</label>

	<label class="input input-bordered input-disabled flex items-center gap-2">
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
		<input type="email" name="email" bind:value={email} placeholder="Email" class="grow" disabled />
	</label>

	{#if form?.ok}
		<div role="alert" class="alert alert-success">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>Changes saved succesfully!</span>
		</div>
	{/if}

	<button type="submit" class="btn btn-primary">Save</button>
</form>
