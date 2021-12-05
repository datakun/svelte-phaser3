<script>
	import { push } from 'svelte-spa-router';
</script>

<div class="buttonContainer">
	<button on:click={() => push('/slipslip')}> 미끌미끌 </button>
	<div class="divider" />
	<button on:click={() => push('/letgo')}> 놓아놓아 </button>
</div>

<style>
	/* 화면 가운데 css */
	.buttonContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.divider {
		width: 8px;
		height: auto;
		display: inline-block;
	}
</style>
