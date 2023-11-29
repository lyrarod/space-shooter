import "./style.css";
import { Game } from "./classes/Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new Game(canvas, context);

  game.render();

  console.log(game);
});
