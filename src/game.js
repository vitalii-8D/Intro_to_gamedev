import Paddle from "./paddle.js";
import Ball from "./ball.js";
import InputHandler from "./input.js";

import {buildLevel, level1} from "./levels.js";

const GAME_STATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3
}

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];

        this.gamestate = GAME_STATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        new InputHandler(this);
    }

    start() {
        if (this.gamestate !== GAME_STATE.MENU) return;

        this.gamestate = GAME_STATE.RUNNING;

        let bricks = buildLevel(this, level1);

        this.gameObjects = [
            this.ball,
            this.paddle,
            ...bricks
        ];
    }

    update(deltaTime) {
        if (this.gamestate === GAME_STATE.PAUSED
            || this.gamestate === GAME_STATE.MENU) return;

        this.gameObjects.forEach(object => object.update(deltaTime));

        this.gameObjects = this.gameObjects.filter(obj => !obj.markedForDeletion)
    }

    draw(ctx) {
        this.gameObjects.forEach(object => object.draw(ctx));

        if (this.gamestate === GAME_STATE.PAUSED) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", this.gameWidth / 2, this.gameHeight / 2);
        }

        if (this.gamestate === GAME_STATE.MENU) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Press SPACEBAR to start!", this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    togglePause() {
        if (this.gamestate === GAME_STATE.PAUSED) {
            this.gamestate = GAME_STATE.RUNNING;
        } else {
            this.gamestate = GAME_STATE.PAUSED;
        }
    }
}
