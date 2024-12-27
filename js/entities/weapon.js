class Staff {
    constructor(player) {
        this.player = player;
        this.damage = 50;
        this.attackSpeed = 0.8;
        this.lastAttackTime = 0;
        this.projectileSpeed = 500;
        this.range = 1000;
        
        
        if (!Staff.fireballImage) {
            Staff.fireballImage = new Image();
            Staff.fireballImage.src = 'assets/sprites/fireball.png';
        }
    }

    createFireball(angle) {
        return {
            x: this.player.x,
            y: this.player.y,
            width: 32,
            height: 32,
            speed: this.projectileSpeed,
            damage: this.damage,
            angle: angle,
            distanceTraveled: 0,
            range: this.range,
            pierce: this.player.hasPierceShot,
            
            update: function(deltaTime) {
                const dx = Math.cos(this.angle) * this.speed * deltaTime;
                const dy = Math.sin(this.angle) * this.speed * deltaTime;
                this.x += dx;
                this.y += dy;
                this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
            },
            
            render: function(ctx) {
                if (!Staff.fireballImage || !Staff.fireballImage.complete) return;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                
                ctx.drawImage(
                    Staff.fireballImage,
                    -this.width/2, -this.height/2,
                    this.width, this.height
                );
                
                ctx.restore();
            }
        };
    }

    attack() {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime >= 1000 / this.attackSpeed) {
            const angle = this.player.getAimDirection();
            
            
            const fireball1 = this.createFireball(angle);
            
            if (window.game.addProjectile(fireball1)) {
                this.lastAttackTime = currentTime;
                
                
                if (this.player.hasDualShot) {
                    const oppositeAngle = angle + Math.PI; 
                    const fireball2 = this.createFireball(oppositeAngle);
                    window.game.addProjectile(fireball2);
                }
            }
        }
    }
}


Staff.fireballImage = null;
