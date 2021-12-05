import 'phaser';
import { GameScene } from '../Environment';

class UI extends Phaser.Scene {
	constructor() {
		super({
			key: GameScene.UI,
			active: true,
		});

		// 함수 바인딩
		this.createPlayerIndicator = this.createPlayerIndicator.bind(this);
		this.createScoreBoard = this.createScoreBoard.bind(this);
		this.createGameOverScreen = this.createGameOverScreen.bind(this);
		this.updateIndicator = this.updateIndicator.bind(this);
		this.updateScore = this.updateScore.bind(this);
		this.updateHighScore = this.updateHighScore.bind(this);
		this.hideGameOver = this.hideGameOver.bind(this);
		this.showGameOver = this.showGameOver.bind(this);
	}

	preload() {
		// 플레이어 인디케이터
		this.load.image('player_hud', 'assets/images/player_hud.png');
	}

	create() {
		// 플레이어 인디케이터 생성
		this.createPlayerIndicator();

		// 점수판 생성
		this.createScoreBoard();
		this.createGameOverScreen();
	}

	update() {}

	createPlayerIndicator() {
		// 플레이어 인디케이터 생성
		this.playerIndicator = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'player_hud');
		this.playerIndicator.setScale(1.25, 1.25);
		this.playerIndicator.setVisible(false);

		this.indicatorBound = 40;
	}

	createScoreBoard() {
		// 스코어 폰트 설정
		const fontSize = 32;
		const scoreFont = `${fontSize}px Arial`;
		const font = { font: scoreFont, fill: '#ffffff', align: 'center' };

		// 게임 스코어 생성
		this.scoreLabel = this.add.text(fontSize / 2, fontSize, '', font);
		this.scoreLabel.setOrigin(0, 0.5);
		this.children.bringToTop(this.scoreLabel);

		// 하이 스코어 생성
		this.highScoreLabel = this.add.text(this.sys.canvas.width - fontSize / 2, fontSize, '', font);
		this.highScoreLabel.setOrigin(1, 0.5);
		this.children.bringToTop(this.highScoreLabel);
	}

	createGameOverScreen() {
		// 스코어 폰트 설정
		const fontSize = 54;
		const scoreFont = `${fontSize}px Arial`;
		const font = { font: scoreFont, fill: '#ffffff', align: 'center' };

		// 게임 스코어 생성
		this.gameOverScoreLabel = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 4, '', font);
		this.gameOverScoreLabel.setOrigin(0.5, 0.5);
		this.children.bringToTop(this.gameOverScoreLabel);

		// 하이 스코어 생성
		this.gameOverHighScoreLabel = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, '', font);
		this.gameOverHighScoreLabel.setOrigin(0.5, 0.5);
		this.children.bringToTop(this.gameOverHighScoreLabel);

		// 다시 시작 안내 생성
		this.gameOverRestartLabel = this.add.text(this.sys.canvas.width / 2, (this.sys.canvas.height / 2) * 1.5, `Press 'Z' to Start`, font);
		this.gameOverRestartLabel.setOrigin(0.5, 0.5);
		this.children.bringToTop(this.gameOverRestartLabel);

		this.gameOverScoreLabel.setVisible(false);
		this.gameOverHighScoreLabel.setVisible(false);
	}

	updateIndicator(x, y) {
		this.playerIndicator.setVisible(false);

		if (x < 0) {
			this.playerIndicator.setVisible(true);

			this.playerIndicator.x = this.indicatorBound;
		} else if (x > this.sys.canvas.width) {
			this.playerIndicator.setVisible(true);

			this.playerIndicator.x = this.sys.canvas.width - this.indicatorBound;
		} else {
			this.playerIndicator.x = x;
		}

		if (y < 0) {
			this.playerIndicator.setVisible(true);

			this.playerIndicator.y = this.indicatorBound;
		} else if (y > this.sys.canvas.height) {
			this.playerIndicator.setVisible(true);

			this.playerIndicator.y = this.sys.canvas.height - this.indicatorBound;
		} else {
			this.playerIndicator.y = y;
		}
	}

	updateScore(score) {
		this.scoreLabel.setText(score);
		this.children.bringToTop(this.scoreLabel);
	}

	updateHighScore(highScore) {
		this.highScoreLabel.setText(`High: ${highScore}`);
		this.children.bringToTop(this.highScoreLabel);
	}

	hideGameOver() {
		// 게임오버 글자 지우기
		this.gameOverScoreLabel.setVisible(false);
		this.gameOverHighScoreLabel.setVisible(false);
		this.gameOverRestartLabel.setVisible(false);

		// 플레이어 인디케이터 초기화
		this.playerIndicator.setVisible(false);

		// 점수 글자 표시
		this.scoreLabel.setVisible(true);
		this.highScoreLabel.setVisible(true);
	}

	showGameOver(score, highScore) {
		// 점수 글자 지우기
		this.scoreLabel.setVisible(false);
		this.highScoreLabel.setVisible(false);

		// 점수 메시지 생성
		let scoreMessage = `Score: ${score}`;
		let highScoreMessage = `High Score: ${highScore}`;
		if (score > highScore) {
			scoreMessage = [`New High Score!`, `Score: ${score}`];
			highScoreMessage = `High Score: ${score}`;
		}
		let restartMessage = `Press 'Z' to Retry`;

		// 게임 오버 글자 표시
		this.gameOverScoreLabel.setVisible(true);
		this.gameOverHighScoreLabel.setVisible(true);
		this.gameOverRestartLabel.setVisible(true);

		this.gameOverScoreLabel.setText(scoreMessage);
		this.gameOverHighScoreLabel.setText(highScoreMessage);
		this.gameOverRestartLabel.setText(restartMessage);

		// // 플레이어 인디케이터 숨기기
		// this.playerIndicator.setVisible(false);
	}
}

export default UI;
