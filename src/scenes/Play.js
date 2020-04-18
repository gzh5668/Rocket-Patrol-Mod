class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images and tile sprite
        this.load.image('rocket', './assets/rocket.png') //(string::key, location of image)
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //place the tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 20, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(615, 5, 20, 455, 0xFFFFFF).setOrigin(0, 0);

        //green UI background
        this.add.rectangle(30, 42, 580, 64, 0x00FF00).setOrigin(0, 0);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 182, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 251, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 320, 'spaceship', 0, 10).setOrigin(0, 0);

        // p1 keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //add rocket (p1) //setscale used to shrink sprite
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket', 0, keyF, keyLEFT, keyRIGHT, true).setScale(0.5, 0.5).setOrigin(0, 0);

        // p2 keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.p2Rocket = new Rocket(this, game.config.width/2 - 8, 110, 'rocket', 0, keyF, keyLEFT, keyRIGHT, false).setScale(0.5, 0.5).setOrigin(0, 0);
        this.p2Rocket.setFlipY(true);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30,
        });

        //score display:
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#4183f3',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        }
        this.scoreLeft = this.add.text(69, 54,  this.p1Rocket.score, scoreConfig);
        this.scoreRight = this.add.text(469, 54, this.p2Rocket.score, scoreConfig);
        this.add.text(69, 63, 'p1');
        this.add.text(469, 63, 'p2');

        this.gameOver = false;
        // 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2.5, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2.5 + 64, this.p1Rocket.score > this.p2Rocket.score ? 'p1 wins' : 'p2 wins', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2.5 + 128, 'C to Restart or A for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // scroll starfield
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket, this.scoreLeft);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket, this.scoreLeft);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket, this.scoreLeft);
        }

        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, this.p2Rocket, this.scoreRight);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02, this.p2Rocket, this.scoreRight);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01, this.p2Rocket, this.scoreRight);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height && rocket.y + rocket.height > ship.y) {
                return true;
            } else {
                return false;
            }
    }


    shipExplode(ship, player, scoreBoard) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score update
        player.score += ship.points;
        scoreBoard.text = player.score;
        this.sound.play('sfx_explosion');
    }
}