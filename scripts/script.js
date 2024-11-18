
const wrapper = document.querySelector(".wrapper");
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

const playBoardElement = document.getElementById("play-board");
const menuElement = document.getElementById("menu");
const menuText = document.getElementById("menu-text");
const audio = document.getElementById("audio");

const buttonElement = document.querySelector(".button");

var controlLock;
let gameOver;
let win;

let foodX, foodY;
let snakeX, snakeY;
let snakeBody = [];
let velocityX, velocityY;
let setIntervalId;
let score;

const createGame = () => {
  controlLock = false;
  gameOver = false;
  win = false;

  snakeX = 5, snakeY = 10;
  snakeBody = [];
  velocityX = 0, velocityY = 0;
  score = 0;
}

// pegando o highscore
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// botão de reload
buttonElement.addEventListener("click", () => {
  menuElement.style.display = "none";
  playBoardElement.style.display = "grid";

  createGame();
  changeFoodPosition();
  setIntervalId = setInterval(initGame, 150);
  initGame();

  document.addEventListener("keydown", changeDirection);
})


// Cria um valor aleatório para a posição da comida entre 0 - 30
const changeFoodPosition = () => {
  let overlap;

  do {
    overlap = false;
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    
    for (let i = 0; i < snakeBody.length; i++) {
      if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
        overlap = true;
      }
    }
  } while (overlap);
}

const handleGameOver = () => {
  clearInterval(setIntervalId);
  menuElement.style.display = "flex";
  playBoardElement.style.display = "none";
  
  menuText.textContent = "Game Over 😢"
  buttonElement.textContent = "Reiniciar";
}

const handleWin = () => {
  clearInterval(setIntervalId);
  menuElement.style.display = "flex";
  playBoardElement.style.display = "none";
  
  menuText.textContent = "Parabéns! 😁👍"
  buttonElement.textContent = "Reiniciar";
}

const changeDirection = (e) => {
  if (controlLock) return;
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  controlLock = true;
}

controls.forEach(key => {
  // habilita o controle das setas na tela
  key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame = () => {
  
  if (gameOver) return handleGameOver();
  
  // let htmlMarkup = `<img class="food" style="grid-area: ${foodY} / ${foodX}" src="assets/img/food.webp">`;
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  
  // Verifica se a cobra encostou na comida
  if (snakeX === foodX && snakeY === foodY) {
    audio.play();
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // passa a posição da comida para o corpo
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Pontos: ${score}`;
    highScoreElement.innerText = `Recorde: ${highScore}`;
  }

  if (score === 30) {
    return handleWin();
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // passa para frente uma unidade os elementos do corpo
    snakeBody[i] = snakeBody[i-1];
  }
  
  snakeBody[0] = [snakeX, snakeY];
  
  // Atualizando a posição da cabeça baseado na velocidade atual
  snakeX += velocityX;
  snakeY += velocityY;
  
  // checa se a cabeça colidiu com alguma parede
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }
  
  
  
  for (let i = 0; i < snakeBody.length; i++) {
    // adicionando uma div para cada segmento do corpo
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    
    // checa se a cabeça colidiu com o resto do corpo
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }
  
  controlLock = false;
  playBoard.innerHTML = htmlMarkup;
}

document.addEventListener("keydown", changeDirection);