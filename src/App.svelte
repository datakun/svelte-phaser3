<script>
	import Router from 'svelte-spa-router';
	import GameLetGo from './component/GameLetGo.svelte';
	import GameSlipSlip from './component/GameSlipSlip.svelte';
	import Home from './component/Home.svelte';

	const routes = {
		'/': Home,
		'/slipslip': GameSlipSlip,
		'/letgo': GameLetGo,
	};
</script>

<Router {routes} />
