<script>
	import { createEventDispatcher } from 'svelte';

	import { doubled } from '../store';

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('increment', {
			value: doubled,
		});
	};
</script>

<h3>doubled: {$doubled}</h3>

<button on:click={handleClick}>click me</button>
