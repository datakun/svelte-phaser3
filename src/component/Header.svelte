<script>
	import Doubled from './Doubled.svelte';
	import { doubled } from '../store';

	/** @type {number[]} */
	let content = [];

	// state 에 따라 자동으로 전역 state가 변경되도록 처리.
	$: doubled.update((value) => content.map((data) => data * 2));

	const handleIncrement = (event) => {
		// get random integer
		console.log(event);
		const random = Math.floor(Math.random() * 3);
		content.push(random);
		// state 변경을 위해서는 assign 이 필요
		content = content;
	};
</script>

{#if content.length < 5}
	<!-- content here -->
	<h1>content: {content}</h1>
{:else}
	<!-- else content here -->
	<h1>is over content: {content}</h1>
{/if}

<Doubled on:increment={handleIncrement} />
