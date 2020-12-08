import Paddle from "./paddle.js";
import Ball from "./ball.js";
import InputHandler from "./input.js";
import Brick from "./brick.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

    }

    start() {
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        // this.brick = new Brick(this, {x: 20, y: 20});

        let bricks = [];
        for (let i = 0; i < 8; i++) {
            bricks.push(new Brick(this, {x: i * 100, y: 20}))
        }

        this.gameObjects = [
            this.ball,
            this.paddle,
            ...bricks
        ];

        new InputHandler(this.paddle);
    }

    update(deltaTime) {
        this.gameObjects.forEach(object => object.update(deltaTime));
    }

    draw(ctx) {
        this.gameObjects.forEach(object => object.draw(ctx));
    }
}
