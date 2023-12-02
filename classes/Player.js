import { Laser } from "./Laser";

export class Player {
  constructor(game) {
    this.game = game;

    this.width = 64;
    this.height = 64;
    this.playerWidth = 128;
    this.playerheight = 128;

    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height;

    this.speed = 5;
    this.lives = 5;

    this.framex = 0;
    this.maxFrame = 11;

    this.energy = 100;
    this.maxEnergy = this.energy;
    this.cooldown = false;

    this.player = new Image();
    this.player.src = "player.png";

    this.engineWidth = 128;
    this.engineHeight = 128;
    this.engine = new Image();
    this.engine.src = "engine.png";
    this.engineFrameX = 0;
    this.engineFrameY = 0;
    this.engineMaxFrame = 8;

    this.weaponsWidth = 128;
    this.weaponsHeight = 128;
    this.weapons = new Image();
    this.weapons.src = "weapons.png";
    this.weaponsFrameX = 30;
    this.weaponsFrameY = 0;
    this.weaponsMaxFrame = 35;

    this.shield = {
      width: 128,
      height: 128,
      frameX: 0,
      frameY: 0,
      maxFrame: 20,
      sprite: new Image(),
    };
    this.shield.sprite.src = "shield.png";

    this.laser = new Laser(this.game, this);

    this.frameTimer = 0;
    this.frameInterval = 1000 / 20;

    this.raySfx = new Audio("/audio/engineCircular_002.ogg");
    this.raySfx.volume = 0.2;
    this.raySfx.loop = true;
  }

  draw(context) {
    context.save();

    // HitBox
    if (this.game.debug) {
      context.strokeStyle = "seagreen";
      context.lineWidth = 2;
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    // Shield
    if (this.game.laserOn && this.energy > 1 && !this.cooldown) {
      context.drawImage(
        this.shield.sprite,
        this.shield.frameX * this.shield.width,
        this.shield.frameY * this.shield.height,
        this.shield.width,
        this.shield.height,
        this.x - this.width * 0.5,
        this.y - this.height * 0.4,
        this.shield.width,
        this.shield.height
      );
    }

    // Player
    context.drawImage(
      this.player,
      this.framex * this.playerWidth,
      0,
      this.playerWidth,
      this.playerheight,
      this.x - this.width * 0.5,
      this.y - this.height * 0.4,
      this.playerWidth,
      this.playerheight
    );

    let posX = 0;
    let engineWidth = this.engineWidth * 0.5;

    if (this.game.keyPressed.KeyA) {
      posX = 24;
    } else if (this.game.keyPressed.KeyD) {
      posX = 0;
    } else {
      engineWidth = this.engineWidth;
    }

    // Engine
    if (this.lives >= 1) {
      context.drawImage(
        this.engine,
        this.engineFrameX * this.engineWidth,
        this.engineFrameY * this.engineHeight,
        engineWidth,
        this.engineHeight,
        this.x - this.width * 0.5 + posX,
        this.y - this.height * 0.4,
        engineWidth,
        this.engineHeight
      );
    }

    // Weapons
    if (this.game.laserOn && this.energy > 1 && !this.cooldown) {
      context.drawImage(
        this.weapons,
        this.weaponsFrameX * this.weaponsWidth,
        this.weaponsFrameY * this.weaponsHeight,
        this.weaponsWidth,
        this.weaponsHeight,
        this.x - this.width * 0.5,
        this.y - this.height * 0.4,
        this.weaponsWidth,
        this.weaponsHeight
      );
    }

    if (this.y + this.playerheight - this.height * 0.5 > this.game.height) {
      this.y -= 2;
    }
    context.restore();
  }

  update(context, deltaTime) {
    this.draw(context);

    if (this.energy <= this.maxEnergy) {
      this.energy += 0.5;
    }

    if (this.energy <= 1) {
      this.cooldown = true;
    } else if (this.energy > this.maxEnergy * 0.3) {
      this.cooldown = false;
    }

    if (this.game.laserOn) {
      if (this.energy >= 0) this.energy -= 1;
      // console.log(this.cooldown);

      if (this.energy > 1 && !this.cooldown) {
        this.laser.update(context, deltaTime);
      } else {
        this.raySfx.currentTime = 0;
        this.raySfx.pause();
      }

      if (this.raySfx.currentTime > 4.8) {
        this.raySfx.currentTime = 0;
      }
      // console.log(this.raySfx.currentTime);
    }

    if (this.frameTimer > this.frameInterval) {
      if (this.lives < 1) {
        this.framex++;
      }
      this.engineFrameX++;
      this.shield.frameX++;

      if (this.engineFrameX >= this.engineMaxFrame) {
        this.engineFrameX = 0;
      }
      if (this.shield.frameX >= this.shield.maxFrame) {
        this.shield.frameX = 0;
      }
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (
      (this.game.keyPressed.KeyA || this.game.moveLeft) &&
      this.x + this.width * 0.5 > 0
    ) {
      this.x -= this.speed;
    }
    if (
      (this.game.keyPressed.KeyD || this.game.moveRight) &&
      this.x + this.width * 0.5 < this.game.width
    ) {
      this.x += this.speed;
    }

    if (this.game.keyPressed.KeyW && this.y > this.height * 0.5) {
      this.y -= this.speed;
    }
    if (
      this.game.keyPressed.KeyS &&
      this.y + this.playerheight - this.height * 0.5 < this.game.height
    ) {
      this.y += this.speed;
    }
  }
}
