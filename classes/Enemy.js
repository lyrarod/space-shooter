export class Enemy {
  constructor(game) {
    this.game = game;

    this.width = 32;
    this.height = 32;
    this.x = 32 + Math.random() * (this.game.width - this.width * 3);
    this.y = -this.height * 0.5;
    // this.y = 0;

    this.framex = 0;
    this.framey = 0;
    this.maxFrame = 9;

    this.enemies = [];

    this.frameTimer = 0;
    this.frameInterval = 90;

    this.dx = Math.random() < 0.33 ? 0.5 : Math.random() < 0.66 ? -0.5 : 0;
    this.speed = 0.1 + Math.random();
    this.color = "red";
    this.energy = 1 + Math.random() * 10;

    this.sprites = [
      "nautolan/enemy_1_bomber.png",
      "nautolan/enemy_2_fighter.png",
      "nautolan/enemy_3_frigate.png",
      "nautolan/enemy_4_scout.png",
      "nautolan/enemy_5_support.png",
      "nautolan/enemy_6_ship.png",
    ];

    this.sprite = new Image();
    this.sprite.src =
      this.sprites[Math.floor(Math.random() * this.sprites.length)];

    this.countEnemies = 0;
    this.frameTimerToNextEnemy = 0;

    this.explosions = [
      // "/audio/explosion/explosionCrunch_000.ogg",
      // "/audio/explosion/explosionCrunch_001.ogg",
      "/audio/explosion/explosionCrunch_002.ogg",
      // "/audio/explosion/explosionCrunch_003.ogg",
      // "/audio/explosion/explosionCrunch_004.ogg",
    ];
    this.explosion = new Audio(
      this.explosions[Math.floor(Math.random() * this.explosions.length)]
    );
    this.explosion.volume = 0.2;
    this.explosion.loop = false;
  }

  restart() {
    this.enemies = [];
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  takeDamage(damage) {
    if (this.energy > 1) {
      this.energy -= damage;
      this.y -= this.speed * 0.5;
    }
  }

  draw(context) {
    context.save();
    if (this.game.debug && this.energy > 1) {
      context.strokeStyle = this.color;
      context.lineWidth = 1;
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
      context.fillStyle = "white";
      context.textAlign = "center";
      context.font = "14px sans-serif";
      context.fillText(
        Math.floor(this.energy),
        this.x + this.width * 0.5,
        this.y + this.height + 10
      );
    }
    context.restore();
  }

  update(context, deltaTime) {
    this.frameTimerToNextEnemy++;
    // console.log("NextEnemy", this.frameTimerToNextEnemy);

    if (this.frameTimerToNextEnemy % 30 === 0) {
      this.addEnemy(new Enemy(this.game));
      this.frameTimerToNextEnemy = 0;
    }

    this.enemies = this.enemies.filter((enemy) => {
      enemy.draw(context);
      enemy.x += enemy.speed * enemy.dx;
      enemy.y += enemy.speed;
      // enemy.y = 100;

      if (enemy.frameTimer > enemy.frameInterval) {
        if (enemy.energy < 1) {
          // console.log(enemy.framex);
          enemy.framex++;

          if (enemy.framex <= 1) {
            // Increment Score
            if (!this.game.collisionDetection(enemy, this.game.player)) {
              this.game.score++;
            }

            enemy.explosion.currentTime = 0;
            enemy.explosion.play();
          }

          if (enemy.framex > enemy.maxFrame) {
            if (
              this.game.player.lives < 1 &&
              this.game.player.framex > this.game.player.maxFrame
            ) {
              this.game.gameOver = true;
            }
            return enemy.framex < enemy.maxFrame;
          }
        }

        if (this.game.collisionDetection(enemy, this.game.player)) {
          if (this.game.player.lives < 1) {
            this.game.laserOn = false;
            this.game.player.speed = 0;
          }

          // Decrement Lives & Score
          if (this.game.player.lives >= 1 && enemy.framex === 0) {
            this.game.score -= Math.floor(enemy.energy).toFixed();
            this.game.player.lives--;
            enemy.energy = 0;
          }
        }

        enemy.frameTimer = 0;
      } else {
        enemy.frameTimer += deltaTime;
      }

      if (enemy.x < 0 || enemy.x + enemy.width > this.game.width) {
        enemy.dx *= -1;
        enemy.speed += 0.25;
      }

      if (enemy.y > this.game.height) {
        this.game.score -= Math.floor(enemy.energy).toFixed();

        if (this.game.player.lives >= 1) this.game.player.lives--;

        if (this.game.player.lives < 1) this.game.gameOver = true;
      }

      return enemy.y < this.game.height;
    });

    // console.log(this.enemies);
  }
}
