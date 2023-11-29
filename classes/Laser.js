export class Laser {
  constructor(game, player) {
    this.game = game;
    this.player = player;

    this.width = 18;
    this.height = this.game.height;
    // this.height = this.game.height - this.player.height;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.gap = 12;
    this.scale = 21.4;

    this.sprite = new Image();
    this.sprite.src = "ray.png";

    this.frameX = 0;
    this.maxFrame = 4;

    this.frameTimer = 0;
    this.frameInterval = 60;
  }

  draw(context) {
    const { player } = this;

    let position = {
      x: player.x + player.width * 0.5 - this.width * 0.5,
      y: player.y - player.height * 0.4 - this.height,
    };

    context.save();
    context.fillStyle =
      player.energy < player.maxEnergy * 0.3 ? "red" : "transparent";
    context.fillRect(
      (this.x = position.x),
      (this.y = position.y),
      this.width,
      this.height + this.gap
    );

    context.drawImage(
      this.sprite,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      (this.x = position.x),
      (this.y = position.y),
      this.width,
      this.height * this.scale
    );
    context.restore();
  }

  update(context, deltaTime) {
    this.draw(context);

    this.game.boss.bosses.forEach((boss) => {
      if (this.game.collisionDetection(this, boss) && boss.y > 0) {
        boss.takeDamage(0.25);
      }
    });

    this.game.enemy.enemies.forEach((enemy) => {
      if (this.game.collisionDetection(this, enemy) && enemy.y > 0) {
        enemy.takeDamage(0.5);
      }
    });

    this.game.greyBoss.greys.forEach((grey) => {
      if (this.game.collisionDetection(this, grey) && grey.y > 0) {
        grey.takeDamage(0.25);
      }
    });

    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0;
      }
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
}
