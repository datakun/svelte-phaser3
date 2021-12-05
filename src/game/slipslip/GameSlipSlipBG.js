import 'phaser';
import { GameScene } from '../Environment';

class GameSlipSlipBG extends Phaser.Scene {
	constructor() {
		super({
			key: GameScene.GameSlipSlipBG,
			active: true,
		});

		// 함수 바인딩
		this.createBackground = this.createBackground.bind(this);
		this.moveBackground = this.moveBackground.bind(this);
	}

	preload() {
		// 배경 이미지 불러오기
		this.load.image('background', 'assets/images/glacial_mountain.png');
	}

	create() {
		this.backgroundMoveInterval = 500;
		this.ratio = 1.0;

		// 배경 생성
		this.createBackground();
	}

	update() {}

	createBackground() {
		this.background = this.add.image(this.sys.canvas.width / 2, 0, 'background');
		this.background.setOrigin(0.45, 0);
		this.children.sendToBack(this.background);

		// 배경이 화면에 꽉 차도록 비율 계산
		const widthRatio = (this.sys.canvas.width / this.background.width) * 1.5;
		const heightRatio = (this.sys.canvas.height / this.background.height) * 1.5;
		if (widthRatio < heightRatio) {
			this.ratio = heightRatio;
		} else {
			this.ratio = widthRatio;
		}

		this.background.setScale(this.ratio, this.ratio);
	}

	moveBackground() {
		if (this.background.y + this.background.height * this.ratio > this.sys.canvas.height) {
			this.background.y -= 1;
		}
	}

	resetBackground() {
		// 배경 이동 타이머 등록
		this.background.y = 0;
		this.backgroundTimer = this.time.addEvent({
			delay: this.backgroundMoveInterval * this.ratio,
			callback: this.moveBackground,
			loop: true,
		});
	}

	stopBackground() {
		this.time.removeAllEvents();
	}
}

export default GameSlipSlipBG;
