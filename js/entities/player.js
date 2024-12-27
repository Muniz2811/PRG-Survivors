class Player {
    constructor(x, y, classInfo) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.speed = 200;
        this.health = 100;
        this.maxHealth = 100;
        this.hasDualShot = false;
        this.hasPierceShot = false;

        if (!Player.mageSprite) {
            Player.mageSprite = new Image();
            Player.mageSprite.src = 'assets/sprites/mage.png';
        }

        this.weapon = new Staff(this);
        
        this.aimAngle = 0;
        this.facingLeft = false;
        window.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.aimAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
            this.facingLeft = Math.abs(this.aimAngle) > Math.PI / 2;
        });
    }

    update(deltaTime) {

        const input = window.game.input;
        let dx = 0;
        let dy = 0;

        if (input.isKeyPressed('w') || input.isKeyPressed('ArrowUp')) dy -= 1;
        if (input.isKeyPressed('s') || input.isKeyPressed('ArrowDown')) dy += 1;
        if (input.isKeyPressed('a') || input.isKeyPressed('ArrowLeft')) dx -= 1;
        if (input.isKeyPressed('d') || input.isKeyPressed('ArrowRight')) dx += 1;

        
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        
        this.x += dx * this.speed * deltaTime;
        this.y += dy * this.speed * deltaTime;

        
        this.x = Math.max(this.width/2, Math.min(window.game.canvas.width - this.width/2, this.x));
        this.y = Math.max(this.height/2, Math.min(window.game.canvas.height - this.height/2, this.y));

        
        this.weapon.attack();
    }

    getAimDirection() {
        return this.aimAngle;
    }

    render(ctx) {
        if (!Player.mageSprite || !Player.mageSprite.complete) return;
        
        ctx.save();
        
        
        if (this.facingLeft) {
            ctx.translate(this.x + this.width/2, this.y - this.height/2);
            ctx.scale(-1, 1);
            ctx.drawImage(Player.mageSprite, 0, 0, 48, 48, -this.width, 0, this.width, this.height);
        } else {
            ctx.drawImage(Player.mageSprite, 0, 0, 48, 48, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        }
        
        ctx.restore();
        
        
        const healthBarWidth = 50;
        const healthBarHeight = 5;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 10, healthBarWidth, healthBarHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 10, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);
        
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(`Dual Shot: ${this.hasDualShot}`, 10, 60);
        ctx.fillText(`Pierce Shot: ${this.hasPierceShot}`, 10, 80);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            window.game.gameState.gameOver = true;
            return true;
        }
        return false;
    }
}


Player.mageSprite = null;
