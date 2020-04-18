// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, fire, L, R, isP1) {
        super(scene, x, y, texture, frame);
        this.fireKey = fire;
        this.leftKey = L;
        this.rightKey = R;
        this.p1mark = isP1;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        scene.add.existing(this);
        this.isFiring = false;
        this.score = 0;
    }

    deicder() {
        if (this.p1mark) {
            return 431;
        } else {
            return 110;
        }
    }

    update() {
        // movement
        if (!this.isFiring) {
            if (this.leftKey.isDown && this.x >= 47) {
                this.x -= 2;
            } else if (this.rightKey.isDown && this.x <= 578) {
                this.x += 2;
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.isFiring = true; 
            if (this.y == this.deicder()) {
                this.sfxRocket.play();
            }
        }
        // if fired, move up
        if (this.p1mark) {
            if (this.isFiring && this.y >= 108) {
                this.y -= 2;
            }
            // reset on miss
            if (this.y < 108) {
                this.reset();
            }
        }
        else {
            if (this.isFiring && this.y <= 431) {
                this.y += 2;
            }
            // reset on miss
            if (this.y > 431) {
                this.reset();
            }
        }
    }

    reset() {
        this.isFiring = false;
        this.y = this.deicder();
    }
}