export default class Ball {
    constructor() {
        this.image = document.getElementById('img_ball');
    }

    draw(ctx) {
        ctx.drawImage(this.image, 20, 20, 25, 25);
    }

    update() {

    }
}
