class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion.mp3');
        this.load.audio('sfx_rocket', './assets/darts.mp3');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '23px',
            backgroundColor: '#41dcf3',
            color: '#130801',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }
        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        
        this.add.text(centerX, centerY - textSpacer*1.5, 'ROCKET PATROL MOD', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - textSpacer*0.5, 'P1 Use ← → to move & ENTER to Fire', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*0.5, 'P2 Use <A> <D> to move & C to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer*1.5, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5)

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //this.scene.start("playScene")
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 5,
                gameTimer: 45000,
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}