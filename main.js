import "./style.css";
import { Game } from "./classes/Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new Game(canvas, context);

  const startGameBtn = document.getElementById("startGameBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");

  startGameBtn.addEventListener("click", () => game.start());
  playAgainBtn.addEventListener("click", () => game.playAgain());
});
