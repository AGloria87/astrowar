const canvas = document.querySelector("canvas");
const canvasW = 800;
const canvasH = 950;

const ctx = canvas.getContext("2d");
const playerImg = new Image();

playerImg.src = "./img/sprites/player/idle/0000.png";

ctx.fillRect(0,0,canvasW,canvasH)
ctx.drawImage(playerImg, 400, 400);

console.log(playerImg)