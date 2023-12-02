export class GreyBoss {
  constructor(game) {
    this.game = game;

    this.width = 128;
    this.height = 128;
    this.x = Math.floor(Math.random() * (this.game.width - this.width));
    this.y = -this.height * 0.5;
    // this.y = 0;
    this.dx = Math.random() < 0.5 ? -0.2 : 0.2;
    this.speed = 0.1 + Math.random();
    this.energy = 20 + Math.random() * 21;

    this.sprite = new Image();
    this.sprite.src = "boss.png";

    this.greys = [];

    this.exp = {
      x: 0,
      y: 0,
      width: 64,
      height: 64,
      framex: 0,
      framey: Math.floor(Math.random() * 20),
      maxframe: 15,
      sprite: new Image(),
      isActive: false,
      frameTimer: 0,
      frameInterval: 90,
    };
    this.exp.sprite.src = "smoke_07.png";

    this.frameTimerToNextGreyBoss = 0;

    this.explosions = [
      // "/audio/explosion/explosionCrunch_000.ogg",
      "/audio/explosion/explosionCrunch_001.ogg",
      // "/audio/explosion/explosionCrunch_002.ogg",
      // "/audio/explosion/explosionCrunch_003.ogg",
      // "/audio/explosion/explosionCrunch_004.ogg",
    ];
    this.greyExplosion = new Audio(
      this.explosions[Math.floor(Math.random() * this.explosions.length)]
    );

    this.greyExplosion.volume = 0.4;
    this.greyExplosion.loop = false;
  }

  create(boss) {
    this.greys.push(boss);
  }

  takeDamage(damage) {
    if (this.energy > 1) {
      this.energy -= damage;
      this.y -= this.speed * 0.5;
    }
  }

  draw(ctx) {
    if (this.game.debug && this.energy > 1) {
      ctx.save();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore();
    }

    if (!this.exp.isActive) {
      ctx.save();
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      ctx.restore();
    }

    if (this.exp.isActive) {
      ctx.save();
      ctx.drawImage(
        this.exp.sprite,
        this.exp.framex * this.exp.width,
        this.exp.framey * this.exp.height,
        this.exp.width,
        this.exp.height,
        (this.exp.x = this.x + this.width * 0.5 - this.exp.width * 0.5),
        (this.exp.y = this.y + this.height * 0.5 - this.exp.height * 0.5),
        this.exp.width,
        this.exp.height
      );
      ctx.restore();
    }

    if (this.energy > 1) {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "14px sans-serif";
      ctx.fillText(
        Math.floor(this.energy),
        this.x + this.width * 0.5,
        this.y + this.height - 8
      );
      ctx.restore();
    }
  }

  update(ctx, dt) {
    if (
      this.greys.length < 1 &&
      this.game.enemy.enemies.length > 10 &&
      this.game.enemy.enemies.length < 15
    ) {
      this.frameTimerToNextGreyBoss += 0.1;
      // console.log("frameTimerToNextGreyBoss", this.frameTimerToNextGreyBoss);

      if (this.frameTimerToNextGreyBoss > 30) {
        this.create(new GreyBoss(this.game));
        this.frameTimerToNextGreyBoss = 0;
      }
    }

    this.greys.forEach((grey) => {
      grey.draw(ctx);
      grey.x += grey.speed * grey.dx;
      grey.y += grey.speed;

      if (grey.x < 0 || grey.x + grey.width > this.game.width) {
        grey.dx *= -1;
      }
    });

    this.greys = this.greys.filter((grey) => {
      if (grey.exp.frameTimer > grey.exp.frameInterval) {
        if (grey.energy < 1) {
          grey.exp.framex++;
          grey.exp.isActive = true;
          // console.log(grey.exp.framex++);

          if (grey.exp.framex <= 2) {
            this.game.score += 2;
            grey.greyExplosion.currentTime = 0;
            grey.greyExplosion.play();
          }

          if (grey.exp.framex > grey.exp.maxframe) {
            return grey.exp.framex < grey.exp.maxframe;
          }
        }
        grey.exp.frameTimer = 0;
      } else {
        grey.exp.frameTimer += dt;
      }

      if (grey.y > this.game.height) this.game.score -= 2;

      return grey.y < this.game.height;
    });

    // console.log(this.greys);
  }
}
