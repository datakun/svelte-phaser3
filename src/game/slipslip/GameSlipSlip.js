import 'phaser';
import { GameScene, StorageID } from '../Environment';
import GameSlipSlipBG from './GameSlipSlipBG';
import UI from './UI';

class GameSlipSlipScene extends Phaser.Scene {
	constructor() {
		super({
			key: GameScene.GameSlipSlip,
			active: true,
		});

		// 함수 바인딩
		this.createPlatforms = this.createPlatforms.bind(this);
		this.createAnimations = this.createAnimations.bind(this);
		this.createPlayer = this.createPlayer.bind(this);
		this.movePlatforms = this.movePlatforms.bind(this);
		this.incrementScore = this.incrementScore.bind(this);
		this.startGame = this.startGame.bind(this);
		this.gameOver = this.gameOver.bind(this);
	}

	preload() {
		// 플랫폼 이미지
		this.load.image('snow_platform_left', 'assets/images/snow_platform_left.png');
		this.load.image('snow_platform_right', 'assets/images/snow_platform_right.png');
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
		/** @type {GameSlipSlipBG} */
		this.backgroundScene = null;
		// 플랫폼
		this.floorCount = 10; // 플랫폼 층 수
		this.floorIndex = 0; // 플랫폼 인덱스
		this.difficultyStep = 40; // 난이도 증가 간격
		this.defaultMoveInterval = 960;
		this.platformMoveInterval = this.defaultMoveInterval; // 960 -> 480
		this.defaultVelocity = -200;
		this.platformVelocity = this.defaultVelocity; // -200 -> -400
		// 카메라
		this.cameraRadians = 0; // 카메라 회전각
		this.cameraRotateDuration = 1000; // 카메라 회전 시간
		// 플레이어
		this.player = null;
		this.defaultPlayerSpeed = 430; // 430 -> 550
		this.playerSpeed = this.defaultPlayerSpeed; // 플레이어 이동 속도
		this.walkDirection = 0; // 걷는 방향 0: 중립, -1: 왼쪽, 1: 오른쪽
		this.isPlayerReady = false; // 플레이어 준비 여부
		// 점수
		this.scoreInterval = 100; // 점수 증가 주기
		this.score = 0; // 점수
		this.highScore = 0; // 최고 점수
		this.startTime = 0;

		// 저장된 최고 점수가 있으면 저장된 값 가져오기
		if (window.localStorage.getItem(StorageID.HighScore[GameScene.GameSlipSlip]) !== null) {
			this.highScore = parseInt(window.localStorage.getItem(StorageID.HighScore[GameScene.GameSlipSlip]), 10);
		}

		const platformImage = this.game.textures.get('snow_platform_left').getSourceImage();

		this.platformWidth = platformImage.width;
		this.platformHeight = platformImage.height;

		this.holeWidth = this.sys.canvas.width / 4;

		this.upperOfScreen = -this.platformHeight * 2;
		this.lowerOfScreen = this.sys.canvas.height + this.platformHeight * 2;

		this.leftBound = this.holeWidth / 2;
		this.rightBound = this.sys.canvas.width - this.holeWidth / 2;

		this.playzone = new Phaser.Geom.Rectangle(-this.sys.canvas.width / 2, -this.sys.canvas.height / 2, this.sys.canvas.width * 2, this.sys.canvas.height * 2);

		// 플랫폼 생성

		this.createPlatforms();
		// 키보드 입력 등록
		this.cursors = this.input.keyboard.createCursorKeys();

		this.keyZ = this.input.keyboard.addKey('z');
		this.keyF = this.input.keyboard.addKey('f');

		// 애니메이션 생성
		this.createAnimations();
	}

	update() {
		// this.groupPlatform.refresh();

		if (this.isPlayerReady === true) {
			// 플레이어 인디케이터 업데이트
			this.uiScene.updateIndicator(this.player.x, this.player.y);

			// 화면 바깥에 있는지 확인
			if (this.playzone.contains(this.player.x, this.player.y) === false) {
				this.gameOver();

				return;
			}

			// 3초마다 난이도 상승. this.difficultyStep 단계
			let difficulty = parseInt((performance.now() - this.startTime) / 3000, 10);
			if (difficulty > this.difficultyStep) {
				difficulty = this.difficultyStep;
			}

			// 시간이 지남에 따라 난이도 상승시키기 위해 플랫폼 이동 시간과 화면 회전 시간을 조금씩 줄임
			this.platformMoveInterval = this.defaultMoveInterval - difficulty * (this.defaultMoveInterval / 2 / this.difficultyStep);
			this.platformTimer.delay = this.platformMoveInterval;
			this.platformVelocity = this.defaultVelocity - difficulty * (-this.defaultVelocity / this.difficultyStep);

			this.playerSpeed = this.defaultPlayerSpeed + difficulty * 3;

			// 땅을 밟고 있는지 확인
			var onTheGround = this.player.body.touching.down;

			// 걷는 방향에 따라 velocity 및 애니메이션 적용
			this.player.setVelocityY(this.playerSpeed / 2);
			if (this.walkDirection < 0) {
				// 오른쪽으로 플레이어 이동
				this.player.setVelocityX(this.playerSpeed);

				// 애니메이션 시작
				if (onTheGround) {
					this.player.anims.play('walk_right', true);
				} else {
					this.player.anims.play('jump_right', true);
				}
			} else if (this.walkDirection > 0) {
				// 왼쪽으로 플레이어 이동
				this.player.setVelocityX(-this.playerSpeed);

				// 애니메이션 시작
				if (onTheGround) {
					this.player.anims.play('walk_left', true);
				} else {
					this.player.anims.play('jump_left', true);
				}
			} else {
				if (onTheGround) {
					this.player.anims.play('duck', true);
				} else {
					this.player.anims.play('jump_right', true);
				}
			}

			// 스페이스 키가 눌렸는지 확인. 한번만 실행.
			if (Phaser.Input.Keyboard.JustDown(this.keyZ)) {
				// 스페이스 누를때마다 반대방향으로 화면 회전
				this.cameraRadians = this.walkDirection < 0 ? 6 : 0.24;

				this.cameras.main.rotateTo(this.cameraRadians, true, this.cameraRotateDuration, 'Linear', true);

				this.walkDirection = this.walkDirection < 0 ? 1 : -1;
			}
		} else {
			// 플레이어가 준비 안 된 상태에서 스페이스 입력하면 게임 시작
			if (Phaser.Input.Keyboard.JustDown(this.keyZ)) {
				// 플레이어 생성
				this.startGame();
			} else if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
				// 플레이어 생성. 하드모드
				this.startGame(true);
			}
		}
	}

	createPlatforms() {
		// 플랫폼 그룹 생성
		this.groupPlatformLeft = this.physics.add.group({
			allowGravity: false,
			immovable: true,
			bounceY: 0,
		});

		this.groupPlatformRight = this.physics.add.group({
			allowGravity: false,
			immovable: true,
			bounceY: 0,
		});

		// 플랫폼 생성
		/** @type {Phaser.Types.Physics.Arcade.ImageWithDynamicBody[][]} */
		this.floors = [];
		for (let i = 0; i < this.floorCount; i++) {
			// 플랫폼 추가
			/** @type {Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]} */
			const platforms = [];
			// const left = this.groupPlatform.create(0, this.lowerOfScreen, 'snow_platform_left');
			const left = this.physics.add.image(0, this.lowerOfScreen, 'snow_platform_left');
			this.groupPlatformLeft.add(left);
			platforms.push(left);
			// const right = this.groupPlatform.create(0, this.lowerOfScreen, 'snow_platform_right');
			const right = this.physics.add.image(0, this.lowerOfScreen, 'snow_platform_right');
			this.groupPlatformRight.add(right);
			platforms.push(right);

			this.floors.push(platforms);
		}
	}

	createAnimations() {
		// 걷는 애니메이션 생성
		this.anims.create({
			key: 'walk_right',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 9 }),
			frameRate: 16,
			repeat: -1,
		});

		this.anims.create({
			key: 'walk_left',
			frames: this.anims.generateFrameNumbers('player', { start: 10, end: 19 }),
			frameRate: 16,
			repeat: -1,
		});

		// 점프 애니메이션 생성
		this.anims.create({
			key: 'jump_right',
			frames: this.anims.generateFrameNumbers('player', { start: 20, end: 20 }),
			frameRate: 16,
			repeat: -1,
		});

		this.anims.create({
			key: 'jump_left',
			frames: this.anims.generateFrameNumbers('player', { start: 21, end: 21 }),
			frameRate: 16,
			repeat: -1,
		});

		this.anims.create({
			key: 'duck',
			frames: this.anims.generateFrameNumbers('player', { start: 22, end: 22 }),
			frameRate: 16,
			repeat: -1,
		});
	}

	createPlayer() {
		if (this.player !== null) {
			this.player.destroy();
		}

		// 플레이어 생성
		this.player = this.physics.add.sprite(this.sys.canvas.width / 2, this.upperOfScreen, 'player');

		// 플레이어 사이즈 설정
		this.player.setScale(1.25, 1.25);

		// 물리 설정
		this.player.setGravityY(100);

		// 바닥 그룹이랑 충돌 설정
		this.physics.add.collider(this.player, this.groupPlatformLeft);
		this.physics.add.collider(this.player, this.groupPlatformRight);

		this.player.anims.play('jump_right', true);

		this.walkDirection = 0; // 걷는 방향 0: 중립, -1: 왼쪽, 1: 오른쪽
		this.isPlayerReady = true; // 플레이어 준비 여부
	}

	movePlatforms() {
		// 새 플랫폼 위치 설정
		const currentPlatform = this.floors[this.floorIndex];

		// - 랜덤한 위치에 첫 번째 플랫폼 배치 (holeWidth / 2 ~ canvasWidth - holeWidth / 2)
		let leftPosition = Phaser.Math.Between(this.leftBound, this.rightBound);
		// - 두 번째 플랫폼은 첫 번째 플랫폼의 x + width + holeWidth 에 배치
		let rightPosition = leftPosition + this.platformWidth + this.holeWidth;

		currentPlatform[0].x = leftPosition - this.platformWidth / 2;
		currentPlatform[0].y = this.lowerOfScreen;
		currentPlatform[1].x = rightPosition - this.platformWidth / 2;
		currentPlatform[1].y = this.lowerOfScreen;

		// 플랫폼 위로 이동
		for (let i = 0; i < currentPlatform.length; i++) {
			const platform = currentPlatform[i];

			// 플랫폼의 속도를 변경
			platform.setVelocityY(this.platformVelocity);
		}

		this.floorIndex = (this.floorIndex + 1) % this.floors.length;
	}

	incrementScore() {
		this.score += 1;

		// 점수판 업데이트
		this.uiScene.updateScore(this.score);
	}

	startGame(isHardMode = false) {
		if (this.uiScene === null) {
			this.uiScene = this.scene.get(GameScene.UI);
		}

		this.uiScene.hideGameOver();

		this.uiScene.updateHighScore(this.highScore);

		// 타이머 등록
		this.platformTimer = this.time.addEvent({
			delay: this.platformMoveInterval,
			callback: this.movePlatforms,
			loop: true,
		});

		// 점수 타이머 등록
		this.scoreTimer = this.time.addEvent({
			delay: this.scoreInterval,
			callback: this.incrementScore,
			loop: true,
		});

		this.createPlayer();

		// 배경 이동 타이머 등록
		if (this.backgroundScene === null) {
			this.backgroundScene = this.scene.get(GameScene.GameSlipSlipBG);
		}

		this.backgroundScene.resetBackground();

		if (isHardMode === false) {
			this.startTime = performance.now();
		} else {
			this.startTime = -99999999;
		}
	}

	gameOver() {
		// 글자 및 점수 표시
		if (this.uiScene !== null) {
			// 게임 오버 표시
			this.uiScene.showGameOver(this.score, this.highScore);

			// 최고 점수 업데이트
			if (this.score > this.highScore) {
				this.highScore = this.score;
				window.localStorage.setItem(StorageID.HighScore[GameScene.GameSlipSlip], this.highScore);
			}
		}

		// 타이머 초기화
		this.time.removeAllEvents();

		// 카메라 원위치
		this.cameraRadians = 0;
		this.cameras.main.rotateTo(this.cameraRadians, true, 1000, 'Linear', true);

		// 플랫폼 이동 시간 초기화
		this.floorIndex = 0;
		this.platformMoveInterval = this.defaultMoveInterval;
		this.platformVelocity = this.defaultVelocity;

		// 플랫폼 원위치
		for (let i = 0; i < this.floors.length; i++) {
			for (let j = 0; j < this.floors[i].length; j++) {
				const platform = this.floors[i][j];
				if (platform !== undefined) {
					// 플랫폼 위치 초기화
					platform.y = this.lowerOfScreen;
					platform.setVelocityY(0);
				}
			}
		}

		// 배경이미지 정지
		this.backgroundScene.stopBackground();

		// 플레이어 정지
		this.player.setVisible(false);

		this.walkDirection = 0;
		this.playerSpeed = this.defaultPlayerSpeed;
		this.isPlayerReady = false;
		this.score = 0;
	}
}

export default GameSlipSlipScene;
