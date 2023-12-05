import "./style.css";
import { Game } from "./classes/Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new Game(canvas, context);
  console.log(game);

  const startGameBtn = document.getElementById("startGameBtn");
  const startscreen = document.getElementById("startscreen");
  const buttons = document.getElementById("buttons");
  const playAgainBtn = document.getElementById("playAgainBtn");

  startGameBtn.addEventListener("click", () => {
    game.render();
    startscreen.style.display = "none";
    buttons.style.pointerEvents = "auto";
  });

  playAgainBtn.addEventListener("click", () => {
    game.playAgain();
    playAgainBtn.style.display = "none";
  });

  // game.render();
  // startscreen.style.display = "none";
  // buttons.style.pointerEvents = "auto";
});
