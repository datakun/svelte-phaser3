export const CanvasSize = {
	width: 600,
	height: 600,
};

export const GameScene = {
	UI: 'UI',
	GameSlipSlip: 'GameSlipSlip',
	GameSlipSlipBG: 'GameSlipSlipBG',
	GameLetGo: 'GameLetGo',
};

export const StorageID = {
	HighScore: {
		[GameScene.GameSlipSlip]: GameScene.GameSlipSlip + '_HighScore',
	},
};
