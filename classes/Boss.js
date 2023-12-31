export class Boss {
  constructor(game) {
    this.game = game;

    this.width = 64;
    this.height = 74;
    this.x = Math.random() * (this.game.width - this.width);
    this.y = -this.height;
    this.dx = Math.random() < 0.5 ? -0.2 : 0.2;
    this.speed = 0.2 + Math.random();
    this.energy = 30;
    this.framex = 0;
    this.framey = 0;
    this.maxFrame = 12;

    this.frameTimer = 0;
    this.frameInterval = 60;

    this.sprites = ["nautolan/boss_1.png", "nautolan/boss_2.png"];

    this.sprite = new Image();
    this.sprite.src =
      this.sprites[Math.floor(Math.random() * this.sprites.length)];

    this.bosses = [];

    this.numberOfBoss = 0;
    this.frameTimerToNextBoss = 0;

    this.explosions = [
      // "/audio/explosion/explosionCrunch_000.ogg",
      "/audio/explosion/explosionCrunch_001.ogg",
      "/audio/explosion/explosionCrunch_002.ogg",
      "/audio/explosion/explosionCrunch_003.ogg",
      // "/audio/explosion/explosionCrunch_004.ogg",
    ];
    this.explosion = new Audio(
      this.explosions[Math.floor(Math.random() * this.explosions.length)]
    );
    this.explosion.volume = 0.2;
    this.explosion.loop = false;
  }

  restart() {
    this.bosses = [];
    this.frameTimerToNextBoss = 0;
  }

  create(boss) {
    this.bosses.push(boss);
  }

  takeDamage(damage) {
    if (this.energy >= 1) {
      this.energy -= damage;
      this.y -= this.speed * 0.5;
    }
  }

  draw(context) {
    context.save();
    if (this.game.debug && this.energy > 1) {
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    context.drawImage(
      this.sprite,
      this.framex * this.width * 2,
      this.framey * this.height * 2,
      this.width * 2,
      this.height * 2,
      this.x - this.width * 0.5,
      this.y - this.height * 0.5,
      this.width * 2,
      this.height * 2
    );

    if (this.game.debug && this.energy > 1) {
      context.save();
      context.fillStyle = "white";
      context.textAlign = "center";
      context.font = "14px sans-serif";
      context.fillText(
        Math.floor(this.energy),
        this.x + this.width * 0.5,
        this.y + this.height + 12
      );
      context.restore();
    }

    context.restore();
  }

  update(context, deltaTime) {
    if (
      this.bosses.length < 1 &&
      this.game.greyBoss.greys.length < 1 &&
      this.game.enemy.enemies.length >= 10 &&
      this.game.enemy.enemies.length <= 20
    ) {
      this.frameTimerToNextBoss += 0.1;
      // console.log("frameTimerToNextBoss", this.frameTimerToNextBoss);

      if (this.frameTimerToNextBoss > 100) {
        this.numberOfBoss = Math.random() < 0.5 ? 1 : 2;
        // console.log("numberOfBoss", this.numberOfBoss);

        for (let i = 0; i < this.numberOfBoss; i++) {
          this.create(new Boss(this.game));
        }
        this.frameTimerToNextBoss = 0;
      }
    }

    this.bosses = this.bosses.filter((boss) => {
      boss.draw(context);
      boss.x += boss.speed * boss.dx;
      boss.y += boss.speed;

      if (boss.frameTimer > boss.frameInterval) {
        if (boss.energy < 1) {
          // console.log(boss.framex);
          boss.framex++;

          if (boss.framex <= 1) {
            if (!this.game.collisionDetection(boss, this.game.player)) {
              this.game.score += this.energy;
            }
            boss.explosion.currentTime = 0;
            boss.explosion.play();
          }

          if (boss.framex > boss.maxFrame) {
            if (
              this.game.player.lives < 1 &&
              this.game.player.framex > this.game.player.maxFrame
            ) {
              this.game.gameOver = true;
            }
            return boss.framex < boss.maxFrame;
          }
        }

        if (this.game.collisionDetection(boss, this.game.player)) {
          if (this.game.player.lives < 1) {
            this.game.laserOn = false;
            this.game.player.speed = 0;
          }

          // Decrement Lives & Score
          if (this.game.player.lives >= 1 && boss.framex <= 0) {
            this.game.score -= this.energy;
            this.game.player.lives--;
            boss.energy = 0;
          }
        }

        boss.frameTimer = 0;
      } else {
        boss.frameTimer += deltaTime;
      }

      if (boss.x < 0 || boss.x + boss.width > this.game.width) {
        boss.dx *= -1;
        // boss.speed += 0.2;
      }

      if (boss.y > this.game.height) {
        this.game.score -= this.energy;

        if (this.game.player.lives >= 1) this.game.player.lives--;

        if (this.game.player.lives < 1) this.game.gameOver = true;
      }

      return boss.y < this.game.height;
    });

    // console.log(this.bosses);
  }
}
