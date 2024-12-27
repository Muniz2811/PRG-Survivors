class PowerUp {
    constructor(x, y, type = 'dual') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.collected = false;
        this.floatOffset = 0;
        this.type = type;
        

        if (!PowerUp.dualImage) {
            PowerUp.dualImage = new Image();
            PowerUp.dualImage.src = 'assets/sprites/powerup.png';
        }
        
        if (!PowerUp.pierceImage) {
            PowerUp.pierceImage = new Image();
            PowerUp.pierceImage.src = 'assets/sprites/powerup2.png';
        }
    }

    update(player) {
        if (this.collected) return false;
 
        this.floatOffset = Math.sin(Date.now() / 500) * 5;
        
        
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (this.width + player.width) / 2) {
            this.collected = true;
            if (this.type === 'dual') {
                player.hasDualShot = true;
                console.log('Coletou poder de tiro duplo!');
            } else if (this.type === 'pierce') {
                player.hasPierceShot = true;
                console.log('Coletou poder de tiro penetrante!');
            }
            return true;
        }
        return false;
    }

    render(ctx) {
        if (this.collected) return;
        
        const image = this.type === 'dual' ? PowerUp.dualImage : PowerUp.pierceImage;
        
        if (!image || !image.complete) {
            
            ctx.fillStyle = this.type === 'dual' ? '#ffff00' : '#ff00ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y + this.floatOffset, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        
        const glowSize = 20;
        const gradient = ctx.createRadialGradient(
            this.x, this.y + this.floatOffset, 0,
            this.x, this.y + this.floatOffset, glowSize
        );
        gradient.addColorStop(0, this.type === 'dual' ? 'rgba(255, 255, 0, 0.3)' : 'rgba(255, 0, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.floatOffset, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        
        ctx.drawImage(
            image,
            this.x - this.width/2,
            this.y + this.floatOffset - this.height/2,
            this.width,
            this.height
        );
    }
}


PowerUp.dualImage = null;
PowerUp.pierceImage = null;
