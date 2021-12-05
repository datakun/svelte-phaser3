<script>
	import GameSlipSlipScene from '../game/slipslip/GameSlipSlip';
	import UI from '../game/slipslip/UI';
	import GameSlipSlipBG from '../game/slipslip/GameSlipSlipBG';
	import { CanvasSize } from '../game/Environment';

	/** @type {Phaser.Types.Core.GameConfig} */
	const gameConfig = {
		type: Phaser.AUTO,
		width: CanvasSize.width,
		height: CanvasSize.height,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 100 },
				fps: 30,
				fixedStep: false,
			},
		},
		scale: {
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		backgroundColor: '#479cde', // set a blue background color
		parent: 'game',
		scene: [GameSlipSlipBG, GameSlipSlipScene, UI],
	};

	const game = new Phaser.Game(gameConfig);
</script>

<div id="game" />