const canvas = document.querySelector("canvas");
const canvasW = 800;
const canvasH = 950;

const ctx = canvas.getContext("2d");

const playerShots = [];
const enemies = [];
const enemyShots = []

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

// Enemy functions
function spawnEnemyA() {
  let sprite = new Sprite(ctx, enemyAFrames);
  let enemyX = Math.floor(Math.random() * (canvasW-sprite.width));
  let enemy = new EnemyA(sprite, enemyX, -sprite.height);
  enemy.setSpeed(5);
  enemies.push(enemy)
  return enemy;
}

// Player Instances
const playerSprite = new Sprite(ctx, playerFrames);
const playerSpawnX = (canvasW - playerSprite.width) / 2;
const playerSpawnY = playerSprite.height + 650;
const player = new Player(playerSprite, playerSpawnX, playerSpawnY);
player.setSpeed(10);

// Interval managing drawing and real-time events
const gamePlay = setInterval(() => {
  ctx.clearRect(0, 0, canvasW, canvasH)
  player.sprite.draw(player.posX, player.posY);

  playerShots.forEach(shot => {
    shot.sprite.draw(shot.posX, shot.posY);
    shot.moveUp();
    if (shot.posY + shot.sprite.height < 0) {
      playerShots.splice(playerShots.indexOf(shot), 1);
      shot = null;
      delete shot;
    }
  });

  let spawnChanceEnemyA = Math.floor(Math.random() * 100)
  if (spawnChanceEnemyA > 97) {
    let enemy = spawnEnemyA();
    enemy.shoot();
  }

  enemies.forEach(enemy => {
    enemy.sprite.draw(enemy.posX, enemy.posY);
    enemy.moveDown();
    if (enemy.posY > canvasH) {
      enemies.splice(enemies.indexOf(enemy), 1);
      enemy = null;
      delete enemy;
    }
  });

  enemyShots.forEach(shot => {
    shot.sprite.draw(shot.posX, shot.posY);
    shot.moveDown();
    if (shot.posY > canvasH) {
      enemyShots.splice(enemyShots.indexOf(shot), 1);
      shot = null;
      delete shot;
    }
  });
},1000/60);

// Player Controls
window.addEventListener("keydown", (event, canShoot) => {
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

    case "KeyZ":
      player.shoot();
      break;
  }
});
