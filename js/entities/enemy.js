class Enemy {
    constructor(x, y, isBoss = false) {
        this.x = x;
        this.y = y;
        this.width = isBoss ? 80 : 32;
        this.height = isBoss ? 80 : 32;
        this.hitboxWidth = this.width;
        this.hitboxHeight = this.height;
        this.speed = isBoss ? 100 : 150;
        this.health = isBoss ? 300 : 100;
        this.maxHealth = this.health;
        this.damage = isBoss ? 20 : 10;
        this.lastDamageTime = 0;
        this.damageInterval = 500;
        this.isBoss = isBoss;
        this.facingLeft = false;
        
        if (!Enemy.slimeImage) {
            Enemy.slimeImage = new Image();
            Enemy.slimeImage.src = 'assets/sprites/slime.png';
        }
        
        if (!Enemy.bossImage) {
            Enemy.bossImage = new Image();
            Enemy.bossImage.src = 'assets/sprites/chefe.png';
        }
    }

    update(deltaTime) {
        const player = window.game.player;
        
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const speed = this.speed * deltaTime;
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;
                
                // Atualizar direção do sprite baseado no movimento
                this.facingLeft = dx < 0;
            }

            if (distance < (this.hitboxWidth + player.width) / 2) {
                if (Date.now() - this.lastDamageTime >= this.damageInterval) {
                    player.takeDamage(this.damage);
                    this.lastDamageTime = Date.now();
                }
            }
        }
    }

    render(ctx) {
        const image = this.isBoss ? Enemy.bossImage : Enemy.slimeImage;
        if (!image || !image.complete) {
            ctx.fillStyle = this.isBoss ? '#ff0000' : '#0000ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        ctx.save();
        
        if (this.facingLeft) {
            ctx.translate(this.x + this.width/2, this.y - this.height/2);
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(
                image,
                this.x - this.width/2,
                this.y - this.height/2,
                this.width,
                this.height
            );
        }
        
        ctx.restore();

        const healthBarWidth = this.width;
        const healthBarHeight = 5;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 10, healthBarWidth, healthBarHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 10, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);
        
        // Debug: Desenhar hitbox (comentado)
        /*
        ctx.strokeStyle = 'red';
        ctx.strokeRect(
            this.x - this.hitboxWidth / 2,
            this.y - this.hitboxHeight / 2,
            this.hitboxWidth,
            this.hitboxHeight
        );
        */
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
}

Enemy.slimeImage = null;
Enemy.bossImage = null;
