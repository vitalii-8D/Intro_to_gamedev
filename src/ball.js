import {detectCollision} from "./collisionDetection.js";

export default class Ball {
    constructor(game) {
        this.image = document.getElementById('img_ball');

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;
        this.maxSpeedX = 10;
        this.maxSpeedY = 6;

        this.size = 25;
        this.reset();
    }

    reset() {
        this.position = {x: 10, y: 400}
        this.speed = {x: 6, y: -4}
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size,
            this.size
        );
    }

    update(deltaTime) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // left and right wall
        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }

        // wall on top
        if (this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        if (this.position.y + this.size > this.gameHeight) {
            this.game.lives--;
            this.reset();
        }

        // check collision with paddle
        if (detectCollision(this, this.game.paddle)) {
            let halfOfPaddleX = this.game.paddle.position.x + this.game.paddle.width / 2;
            let halfOfBallX = this.position.x + this.size / 2;
            let multiplier = (halfOfBallX - halfOfPaddleX) / (this.game.paddle.width / 2);

            this.speed.x = multiplier * this.maxSpeedX;
            this.speed.y = -(this.maxSpeedY - Math.abs(multiplier) * 4);
            console.log(this.speed.x, this.speed.y);

            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}
