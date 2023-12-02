import "./style.css";
import { Game } from "./classes/Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new Game(canvas, context);
  console.log(game);

  const startBtn = document.getElementById("startBtn");
  const startscreen = document.getElementById("startscreen");
  const buttons = document.getElementById("buttons");

  // game.render();
  // startscreen.style.display = "none";

  startBtn.addEventListener("click", () => {
    game.render();
    startscreen.style.display = "none";
    buttons.style.pointerEvents = "auto";
  });
});
