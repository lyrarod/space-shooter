import { Boss } from "./Boss";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { GreyBoss } from "./GreyBoss";

export class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width = 600;
    this.height = this.canvas.height = 800;

    this.keyPressed = {};
    this.handleKeyPressed();

    this.player = new Player(this);
    this.enemy = new Enemy(this);
    this.boss = new Boss(this);
    this.greyBoss = new GreyBoss(this);

    this.allEnemies = [this.greyBoss, this.boss, this.enemy];

    this.gameObjects = [this.player, ...this.allEnemies];

    this.background = {
      x: 0,
      y: 0,
      width: 800,
      height: 800,
      img: new Image(),
      speed: 1,
      frameTimer: 0,
      frameInterval: 1000 / 60,
    };

    this.lives = 3;
    this.score = 0;

    this.debug = false;
    this.lastTime = 0;
  }

  render = (timeStamp = 0) => {
    const deltaTime = timeStamp - this.lastTime;
    // console.log(deltaTime);
    this.lastTime = timeStamp;

    this.context.clearRect(0, 0, this.width, this.height);
    this.backgroundRender(deltaTime);

    this.gameObjects.forEach((object) => {
      object.update(this.context, deltaTime);
    });

    // Score
    this.context.save();
    this.context.font = "30px Impact";
    this.context.shadowOffsetY = 4;
    this.context.shadowColor = "#0005";
    this.context.fillStyle = "white";
    this.context.fillText(`Score: ${this.score}`, 20, 50);
    this.context.restore();

    // Laser bar
    this.context.save();
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = "#0003";
    this.player.cooldown
      ? (this.context.fillStyle = "silver")
      : this.player.energy < this.player.maxEnergy * 0.3
      ? (this.context.fillStyle = "red")
      : (this.context.fillStyle = "gold");
    for (let i = 0; i < this.player.energy; i++) {
      this.context.fillRect(20 + 1 * i, this.height - 20, 1, 10);
    }
    this.context.restore();

    // Laser text
    this.context.save();
    this.context.font = "16px Poppins";
    this.context.fillStyle = "white";
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = "#0007";
    this.context.fillText("Laser", 20, this.height - 25);
    this.context.restore();

    requestAnimationFrame(this.render);
  };

  backgroundRender(deltaTime) {
    this.background.img.src = "/background/nebula1.png";

    this.context.drawImage(
      this.background.img,
      this.background.x,
      this.background.y,
      this.background.width,
      this.background.height
    );
    this.context.drawImage(
      this.background.img,
      this.background.x,
      this.background.y - this.height,
      this.background.width,
      this.background.height
    );

    if (this.background.frameTimer > this.background.frameInterval) {
      this.background.y += this.background.speed;
      if (this.background.y >= this.height) {
        this.background.y = 0;
      }
      this.background.frameTimer = 0;
    } else {
      this.background.frameTimer += deltaTime;
    }
  }

  handleKeyPressed() {
    let lastKey = null;

    addEventListener("keydown", ({ code }) => {
      if (lastKey === code) return;
      lastKey = code;
      this.keyPressed[code] = true;

      if (
        this.keyPressed.Enter &&
        lastKey === "Enter" &&
        !this.player.cooldown
      ) {
        this.player.raySfx.play();
      }

      if (this.keyPressed.KeyR && lastKey === "KeyR") {
        this.debug = !this.debug;
      }
    });

    addEventListener("keyup", ({ code }) => {
      lastKey = null;
      this.keyPressed[code] = false;

      if (!this.keyPressed.Enter && lastKey === null) {
        this.player.raySfx.currentTime = 0;
        this.player.raySfx.pause();
      }

      delete this.keyPressed[code];
    });
  }

  collisionDetection(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
}
