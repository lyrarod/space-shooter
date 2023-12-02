import "./style.css";
import { Game } from "./classes/Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new Game(canvas, context);

  const startBtn = document.getElementById("startBtn");
  const startscreen = document.getElementById("startscreen");
  const buttons = document.getElementById("buttons");

  startBtn.onclick = () => {
    game.render();
    startscreen.style.display = "none";
    buttons.style.pointerEvents = "auto";
  };

  console.log(game);
});
