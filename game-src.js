const canvas = document.querySelector("canvas");
const canvasW = canvas.width;
const canvasH = canvas.height;

const ctx = canvas.getContext("2d");

// Background Image
const bgImg = new Image();
bgImg.src = "./img/ui/background.png";

const backgroundImage = {
  img: bgImg,
  x: 0,
  y: 0,
  speed: 3,

  move: function() {
    this.y += this.speed;
    this.y %= canvasH;
  },

  draw: function() {
    ctx.drawImage(this.img, 0, this.y);
    if (this.speed < 0) {
      ctx.drawImage(this.img, 0, this.y + this.img.height);
    }
    else {
      ctx.drawImage(this.img, 0, this.y - canvasH);
    }
  },
};

const playerShots = [];
const enemiesA = [];
const enemiesB = [];
const enemyShots = [];

// Player Images
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

const playerFrames = [playerF0, playerF1, playerF2, playerF3, playerF4, playerF5]

const playerShotImg = new Image();
playerShotImg.src = "./img/sprites/player/playerShot.png";

// Enemy 1 Images
const enemyAF0 = new Image();
const enemyAF1 = new Image();
const enemyAF2 = new Image();
const enemyAF3 = new Image();
const enemyAF4 = new Image();
const enemyAF5 = new Image();

enemyAF0.src = "./img/sprites/enemyA/default/enemyA_00.png";
enemyAF1.src = "./img/sprites/enemyA/default/enemyA_01.png";
enemyAF2.src = "./img/sprites/enemyA/default/enemyA_02.png";
enemyAF3.src = "./img/sprites/enemyA/default/enemyA_03.png";
enemyAF4.src = "./img/sprites/enemyA/default/enemyA_04.png";
enemyAF5.src = "./img/sprites/enemyA/default/enemyA_05.png";

const enemyAFrames = [enemyAF0, enemyAF1, enemyAF2, enemyAF3, enemyAF4, enemyAF5]
const enemyAShotImg = new Image();
enemyAShotImg.src = "./img/sprites/enemyA/enemyAShot.png";

// Base Classes
class Sprite {
  constructor(ctx, frames) {
    this.ctx = ctx;
    this.frames = frames;
    this.currentFrame = 0;
    this.width = this.frames[0].width;
    this.height = this.frames[0].height;
  }

  draw(x, y) {
    this.ctx.drawImage(this.frames[this.currentFrame], x, y);

    if (this.frames.length > 1) {
      this.currentFrame++;
      if (this.currentFrame >= this.frames.length) {
        this.currentFrame = 0;
      }
    }
  }
}

class Entity {
  constructor(sprite, posX, posY) {
    this.sprite = sprite;
    this.posX = posX;
    this.posY = posY;
    this.speed = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
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

  getBoundRight() {
    return this.posX + this.sprite.width;
  }

  getBoundBottom() {
    return this.posY + this.sprite.height;
  }
}

// Game Character classes
class Player extends Entity {
  constructor(sprite, posX, posY) {
    super(sprite, posX, posY);
    this.hp = 100;
    this.score = 0;
    this.canShoot = true;
  }

  shoot() {
    let shotSprite = new Sprite(ctx, [playerShotImg])
    let shotX = this.posX + (this.sprite.width / 2) - (shotSprite.width / 2);
    let shotY = this.posY - shotSprite.height;
    let shot = new Entity(shotSprite, shotX, shotY)
    shot.setSpeed(30);
    playerShots.push(shot)
  }
}

class EnemyA extends Entity {
  constructor(sprite, posX, posY) {
    super(sprite, posX, posY);
    this.hp = 100;
  }

  shoot() {
    let shotSprite = new Sprite(ctx, [enemyAShotImg])
    let shotX = this.posX + (this.sprite.width / 2) - (shotSprite.width / 2);
    let shotY = this.sprite.height;
    let shot = new Entity(shotSprite, shotX, shotY)
    shot.setSpeed(30);
    enemyShots.push(shot);
  }
}

class UI {
  constructor(ctx, posX, posY) {
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.height = 20;
  }

  drawHPBar(){
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(this.posX, this.posY, 200, this.height)
    if (player.hp > 75){
      this.ctx.fillStyle = "limegreen";
    }
    else if (player.hp > 50){
      this.ctx.fillStyle = "yellow";
    }
    else if (player.hp > 25){
      this.ctx.fillStyle = "orange";
    }
    else if (player.hp > 0){
      this.ctx.fillStyle = "red";
    }
    this.ctx.fillRect(this.posX, this.posY, player.hp*2, this.height)
    this.ctx.strokeStyle = "#444";
    this.ctx.lineWidth = "3";
    this.ctx.strokeRect(this.posX, this.posY, 200, this.height);
  }

  drawScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20pt Zekton";
    let scoreDisplay = String(player.score).padStart(3, '0')
    let txt = `Score: ${scoreDisplay}`
    this.ctx.fillText(txt, canvasW/2 + 230, this.posY + 20)
  }
}

function checkCollision(entityA, entityB) {
  return (entityA.getBoundRight() >= entityB.posX &&
          entityA.getBoundBottom() >= entityB.posY &&
          entityA.posY <= entityB.getBoundBottom() &&
          entityA.posX <= entityB.getBoundRight());
}

// Enemy functions
function spawnEnemyA() {
  let sprite = new Sprite(ctx, enemyAFrames);
  let enemyX = Math.floor(Math.random() * (canvasW-sprite.width));
  let enemy = new EnemyA(sprite, enemyX, -sprite.height);
  enemy.setSpeed(5);
  enemiesA.push(enemy)
  return enemy;
}

// Player Instances
const playerSprite = new Sprite(ctx, playerFrames);
const playerSpawnX = (canvasW - playerSprite.width) / 2;
const playerSpawnY = playerSprite.height + 650;
const player = new Player(playerSprite, playerSpawnX, playerSpawnY);
player.setSpeed(15);

const playerUI = new UI(ctx, 40, 40);

// Interval managing drawing and real-time events
const gamePlay = setInterval(() => {
  if (player.hp <= 0) {
    alert("YA PETATEO :C")
  }
  if (player.score >= 2000) {
    alert("YA GANO :D")
  }

  // Drawing logic
  ctx.clearRect(0, 0, canvasW, canvasH)

  backgroundImage.draw();
  backgroundImage.move();

  player.sprite.draw(player.posX, player.posY);

  let spawnChanceEnemyA = Math.floor(Math.random() * 100)
  if (spawnChanceEnemyA > 97) {
    let enemy = spawnEnemyA();
    enemy.shoot();
  }

  playerShots.forEach((shot, idxPShot) => {
    enemiesA.forEach((enemy, idxEnemyA)=> {
      if (checkCollision(shot, enemy)) {
        player.score += 50;
        enemiesA.splice(idxEnemyA, 1);
        playerShots.splice(idxPShot, 1);
      }
    })

    if (shot.posY + shot.sprite.height < 0) {
      playerShots.splice(idxPShot, 1);
      shot = null;
      delete shot;
    }

    else {
      shot.sprite.draw(shot.posX, shot.posY);
      shot.moveUp();
    }
  });

  enemiesA.forEach((enemy, idx) => {
    if (checkCollision(player, enemy) || enemy.posY > canvasH) {
      if (checkCollision(player, enemy)) {
        player.hp -= 20;
      }
      enemiesA.splice(idx, 1);
      enemy = null;
      delete enemy;
    }
    else {
      enemy.sprite.draw(enemy.posX, enemy.posY);
      enemy.moveDown();
    }
  });

  enemyShots.forEach((shot, idx) => {
    if (checkCollision(player, shot) || shot.posY > canvasH) {
      if (checkCollision(player, shot)) {
        player.hp -= 10;
      }
      enemyShots.splice(idx, 1);
      shot = null;
      delete shot;
    }

    else {
      shot.sprite.draw(shot.posX, shot.posY);
      shot.moveDown();
    }
  });

  // UI Elements
  playerUI.drawHPBar()
  playerUI.drawScore()

},1000/60);

// Player Controls
let keysPressed = {}

window.addEventListener("keydown", event => {
  keysPressed[event.code] = true;

  if (keysPressed["ArrowRight"]) {
    if (player.getBoundRight() < canvasW) {
      player.moveRight();
    }
  }

  if (keysPressed["ArrowLeft"]) {
    if (player.posX > 0) {
      player.moveLeft();
    }
  }

  if (keysPressed["ArrowUp"]) {
    if (player.posY > 0) {
      player.moveUp();
    }
  }

  if (keysPressed["ArrowDown"]){
    if (player.getBoundBottom() < canvasH) {
      player.moveDown();
    }
  }

  if (keysPressed["KeyZ"]) {
    if(player.canShoot){
      player.shoot();
      player.canShoot = false
      const playersRecoil = setInterval(() => {
        player.canShoot = true;
      },500);
    }
  }
});

window.addEventListener("keyup", event => {
  delete keysPressed[event.code];
})