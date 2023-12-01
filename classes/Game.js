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

    this.leftBtn = document.getElementById("left");
    this.rightBtn = document.getElementById("right");
    this.laserBtn = document.getElementById("laser");
    this.moveLeft = false;
    this.moveRight = false;
    this.laserOn = false;

    this.keyPressed = {};
    this.handleKeyPressed();
    this.handleControls();

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

    this.score = 0;
    this.gameOver = false;

    this.lastTime = 0;
    this.debug = false;
  }

  render = (timeStamp = 0) => {
    if (this.gameOver) return;

    const deltaTime = timeStamp - this.lastTime;
    // console.log(deltaTime);
    this.lastTime = timeStamp;

    this.context.clearRect(0, 0, this.width, this.height);
    this.backgroundRender(deltaTime);

    this.gameObjects.forEach((object) => {
      object.update(this.context, deltaTime);
    });

    // Game Over
    if (this.gameOver) {
      this.context.save();
      this.context.font = "90px Impact";
      this.context.textAlign = "center";
      this.context.shadowOffsetY = 6;
      this.context.shadowColor = "#0005";
      this.context.fillStyle = "white";
      this.context.fillText(`GAME OVER`, this.width * 0.5, this.height * 0.5);
      this.context.restore();
    }

    // Score
    this.context.save();
    this.context.font = "30px Impact";
    this.context.shadowOffsetY = 4;
    this.context.shadowColor = "#0005";
    this.context.fillStyle = "white";
    this.context.fillText(`Score: ${this.score}`, 20, 50);
    this.context.restore();

    // Lives
    this.context.save();
    this.context.fillStyle = "white";
    this.context.font = "16px sans-serif";
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = "#0003";
    for (let i = 0; i < this.player.lives; i++) {
      // this.context.fillRect(20 + 16 * i, 60, 10, 20);
      this.context.fillText(`🧡`, 20 + 22 * i, 78);
    }
    this.context.restore();

    // Laser text
    this.context.save();
    this.context.font = "18px Poppins";
    this.context.fillStyle = "white";
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = "#0007";
    this.context.fillText("Laser", 20, this.height - 30);
    this.context.restore();

    // Laser bar
    this.context.save();
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = "#0003";
    this.player.cooldown
      ? (this.context.fillStyle = "silver")
      : this.player.energy < this.player.maxEnergy * 0.3
      ? (this.context.fillStyle = "red")
      : (this.context.fillStyle = "seagreen");
    for (let i = 0; i < this.player.energy; i++) {
      this.context.fillRect(20 + 1 * i, this.height - 24, 1, 14);
    }
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

  handleControls() {
    this.leftBtn.onmousedown = (e) => {
      e.preventDefault();
      this.moveLeft = true;
    };
    this.leftBtn.onmouseup = () => {
      this.moveLeft = false;
    };
    this.rightBtn.onmousedown = (e) => {
      e.preventDefault();
      this.moveRight = true;
    };
    this.rightBtn.onmouseup = () => {
      this.moveRight = false;
    };

    this.leftBtn.ontouchstart = (e) => {
      e.preventDefault();
      this.moveLeft = true;
    };
    this.leftBtn.ontouchend = () => {
      this.moveLeft = false;
    };
    this.rightBtn.ontouchstart = (e) => {
      e.preventDefault();
      this.moveRight = true;
    };
    this.rightBtn.ontouchend = () => {
      this.moveRight = false;
    };

    this.laserBtn.ontouchstart = (e) => {
      e.preventDefault();
      if (!this.player.cooldown && !this.gameOver) {
        this.laserOn = true;
        this.player.raySfx.currentTime = 0;
        this.player.raySfx.play();
        // console.log("ontouchstart", this.laserOn);
      }
    };
    this.laserBtn.ontouchend = () => {
      this.laserOn = false;
      this.player.raySfx.pause();
      // console.log("ontouchend", this.laserOn);
    };

    this.laserBtn.onmousedown = (e) => {
      e.preventDefault();
      if (!this.player.cooldown && !this.gameOver) {
        this.laserOn = true;
        this.player.raySfx.currentTime = 0;
        this.player.raySfx.play();
        // console.log("onmousedown", this.laserOn);
      }
    };
    this.laserBtn.onmouseup = () => {
      this.laserOn = false;
      this.player.raySfx.pause();
      // console.log("onmouseup", this.laserOn);
    };
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
        !this.player.cooldown &&
        !this.gameOver
      ) {
        this.player.raySfx.play();
        this.laserOn = true;
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
        this.laserOn = false;
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
