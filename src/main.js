// Name: Zihan Guo
// Implement a simultaneous two-player mode (50)
// Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (50)
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let game = new Phaser.Game(config);

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
}

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;