const canvas = document.querySelector("canvas");
const canvasW = 800;
const canvasH = 950;

const ctx = canvas.getContext("2d");

const playerF0 = new Image();
const playerF1 = new Image();
const playerF2 = new Image();
const playerF3 = new Image();
const playerF4 = new Image();
const playerF5 = new Image();

playerF0.src = "./img/sprites/player/default/player_00.png";
playerF1.src = "./img/sprites/player/default/player_01.png";
playerF2.src = "./img/sprites/player/default/player_02.png";
playerF3.src = "./img/sprites/player/default/player_03.png";
playerF4.src = "./img/sprites/player/default/player_04.png";
playerF5.src = "./img/sprites/player/default/player_05.png";

const playerFrames = [playerF0,playerF1,playerF2,playerF3,playerF4,playerF5]

class Character {
  constructor(ctx, sprites, posX, posY) {
    this.ctx = ctx;
    this.sprites = sprites;
    this.currentSprite = 0;
    this.width = this.sprites[0].width;
    this.height = this.sprites[0].height;
    this.posX = posX;
    this.posY = posY;
    this.hp = 100;
    this.speed = 10;
  }

  moveRight() {
    this.posX = this.posX + this.speed;
  }

  moveLeft() {
    this.posX = this.posX - this.speed;
  }

  moveUp() {
    this.posY = this.posY - this.speed;
  }

  moveDown() {
    this.posY = this.posY + this.speed;
  }

  draw() {
    this.ctx.drawImage(this.sprites[this.currentSprite], this.posX, this.posY);
    this.currentSprite++;
    if (this.currentSprite >= this.sprites.length) {
      this.currentSprite = 0;
    }
  }

  getBoundRight() {
    return this.posX + this.width;
  }

  getBoundBottom() {
    return this.posY + this.height;
  }
}

const player = new Character(ctx, playerFrames, canvasW / 2, 700);

setInterval(() => {
  ctx.clearRect(0, 0, canvasW, canvasH)
  player.draw()

},1000/60)

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowRight":
      if (player.getBoundRight() < canvasW) {
        player.moveRight();
      }
      break;

    case "ArrowLeft":
      if (player.posX > 0) {
        player.moveLeft();
      }
      break;

    case "ArrowUp":
      if (player.posY > 0) {
        player.moveUp();
      }
      break;

    case "ArrowDown":
      if (player.getBoundBottom() < canvasH) {
        player.moveDown();
      }
      break;
  }
});