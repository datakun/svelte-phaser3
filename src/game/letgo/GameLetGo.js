import 'phaser';
import { GameScene, StorageID } from '../Environment';
import UI from './UI';

class GameLetGo extends Phaser.Scene {
	constructor() {
		super({
			key: GameScene.GameLetGo,
			active: true,
		});

		// 함수 바인딩
		this.createPlatform = this.createPlatform.bind(this);
		this.startGame = this.startGame.bind(this);
		this.gameOver = this.gameOver.bind(this);
	}

	preload() {
		// 배경 이미지
		this.load.image('background', 'assets/images/building_background.png');
		// 타일 이미지
		this.load.image('tile_left', 'assets/images/tile_left.png');
		this.load.image('tile_mid', 'assets/images/tile_mid.png');
		this.load.image('tile_right', 'assets/images/tile_right.png');
		// 눈
		this.load.image('snowball', 'assets/images/snowball.png');
		// 플레이어 스프라이트
		this.load.spritesheet('player', 'assets/images/player.png', {
			frameWidth: 36,
			frameHeight: 48,
		});
	}

	create() {
		// 다른 씬
		/** @type {UI} */
		this.uiScene = null;

		this.createPlatform();
	}

	update() {}

	createPlatform() {}

	startGame() {}

	gameOver() {}
}

export default GameLetGo;
