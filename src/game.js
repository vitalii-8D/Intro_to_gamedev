import Paddle from "./paddle.js";
import Ball from "./ball.js";
import InputHandler from "./input.js";

import {buildLevel, levels} from "./levels.js";

const GAME_STATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEW_LEVEL: 4,
    WIN: 5
}

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];
        this.lives = 3;
        this.bricks = [];

        this.gamestate = GAME_STATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        new InputHandler(this);

        this.levels = levels;
        this.currentLevel = 0;
    }

    start() {
        if (this.gamestate !== GAME_STATE.MENU && this.gamestate !== GAME_STATE.NEW_LEVEL && this.gamestate !== GAME_STATE.WIN) return;
        if (this.gamestate === GAME_STATE.NEW_LEVEL && !this.levels[this.currentLevel]) {
            this.gamestate = GAME_STATE.WIN;
            this.currentLevel = 0;
            return;
        }

        this.gamestate = GAME_STATE.RUNNING;
        this.ball.reset();
        this.bricks = buildLevel(this, this.levels[this.currentLevel]);

        this.gameObjects = [
            this.ball,
            this.paddle
        ];
    }

    update(deltaTime) {
        if (this.lives === 0) this.gamestate = GAME_STATE.GAMEOVER;
        if (this.gamestate === GAME_STATE.WIN) return;

        if (this.gamestate === GAME_STATE.PAUSED
            || this.gamestate === GAME_STATE.MENU
            || this.gamestate === GAME_STATE.GAMEOVER
        ) return;

        if (this.bricks.length === 0) {
            this.currentLevel++;
            this.gamestate = GAME_STATE.NEW_LEVEL;
            this.start();
        }

        [...this.gameObjects, ...this.bricks].forEach(object => object.update(deltaTime));

        this.bricks = this.bricks.filter(obj => !obj.markedForDeletion)
    }

    draw(ctx) {
        [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Lives: ${this.lives}`, 40, 20);

        if (this.gamestate === GAME_STATE.PAUSED) {
            this.drawPause(ctx);
        }

        if (this.gamestate === GAME_STATE.MENU) {
            this.drawMenu(ctx);
        }

        if (this.gamestate === GAME_STATE.GAMEOVER) {
            this.drawGameover(ctx);
        }
        if (this.gamestate === GAME_STATE.WIN) {
            this.drawWin(ctx);
        }
    }

    togglePause() {
        if (this.gamestate === GAME_STATE.PAUSED) {
            this.gamestate = GAME_STATE.RUNNING;
        } else {
            this.gamestate = GAME_STATE.PAUSED;
        }
    }

    // Draw functions
    drawPause(ctx) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", this.gameWidth / 2, this.gameHeight / 2);
    }

    drawMenu(ctx) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACEBAR to start!", this.gameWidth / 2, this.gameHeight / 2);
    }

    drawGameover(ctx) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
            "GAMEOVER!",
            this.gameWidth / 2,
            this.gameHeight / 2
        );
    }
    drawWin(ctx) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(20,240,20,0.5)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "#444444";
        ctx.textAlign = "center";
        ctx.fillText(
            "You win!",
            this.gameWidth / 2,
            this.gameHeight / 2
        );
        ctx.fillText(
            "Press SPACEBAR to start NEW game",
            this.gameWidth / 2,
            this.gameHeight / 2 - 35
        );
    }

    drawText() {
        
    }
}
