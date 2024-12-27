class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.audio = new AudioManager();

        this.input = new InputHandler();

        this.gameState = {
            score: 0,
            level: 1,
            gameOver: false,
            gameStarted: false,
            startTime: 0,
            currentTime: 0,
            bossSpawned: false,
            bossDefeated: false
        };

        this.maxEnemies = 50;
        this.maxProjectiles = 100;
        
        this.background = new Image();
        this.background.src = 'assets/backgrounds/grass.png';

        this.player = null;
        this.projectiles = [];
        this.enemies = [];
        this.powerups = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 1000;
        this.powerupSpawned = false;

        this.classSelection = new ClassSelection(this);

        this.gameLoop = this.gameLoop.bind(this);

        window.game = this;
        requestAnimationFrame(this.gameLoop);
 
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    startGame(playerClass) {
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, playerClass);
        this.gameState.gameStarted = true;
        this.gameState.gameOver = false;
        this.gameState.score = 0;
        this.gameState.startTime = Date.now();
        this.gameState.bossSpawned = false;
        this.gameState.bossDefeated = false;
        this.enemies = [];
        this.projectiles = [];
        this.powerups = [];
        this.powerupSpawned = false;
        
        this.audio.playBackgroundMusic();
    }
    
    spawnEnemy() {
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
            const edge = Math.floor(Math.random() * 4);
            let x, y;
            
            switch(edge) {
                case 0: 
                    x = Math.random() * this.canvas.width;
                    y = -32;
                    break;
                case 1: 
                    x = this.canvas.width + 32;
                    y = Math.random() * this.canvas.height;
                    break;
                case 2: 
                    x = Math.random() * this.canvas.width;
                    y = this.canvas.height + 32;
                    break;
                case 3: 
                    x = -32;
                    y = Math.random() * this.canvas.height;
                    break;
            }
            
            this.enemies.push(new Enemy(x, y));
            this.lastSpawnTime = currentTime;

            this.spawnInterval = Math.max(200, 1000 - (this.gameState.level - 1) * 50);
        }
    }
    
    spawnBoss() {

        const corner = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(corner) {
            case 0: 
                x = 100;
                y = 100;
                break;
            case 1: 
                x = this.canvas.width - 100;
                y = 100;
                break;
            case 2: 
                x = this.canvas.width - 100;
                y = this.canvas.height - 100;
                break;
            case 3: 
                x = 100;
                y = this.canvas.height - 100;
                break;
        }
        
        this.enemies.push(new Enemy(x, y, true));
    }
    
    addProjectile(projectile) {
        if (this.projectiles.length < this.maxProjectiles) {
            this.projectiles.push(projectile);
            return true;
        }
        return false;
    }
    
    gameLoop(timestamp) {
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.background.complete) {
            const pattern = this.ctx.createPattern(this.background, 'repeat');
            this.ctx.fillStyle = pattern;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        if (!this.gameState.gameStarted) {
            this.classSelection.update();
            this.classSelection.render(this.ctx);
            requestAnimationFrame(this.gameLoop);
            return;
        }
        
        if (!this.gameState.gameOver && this.player) {

            if (!this.powerupSpawned && this.gameState.score >= 500) {
                this.powerups.push(new PowerUp(this.canvas.width / 2, this.canvas.height / 2));
                this.powerupSpawned = true;
            }

            this.player.update(deltaTime);
            this.spawnEnemy();

            this.gameState.currentTime = Date.now() - this.gameState.startTime;

            if (!this.gameState.bossSpawned && this.gameState.currentTime >= 30000) {
                this.spawnBoss();
                this.gameState.bossSpawned = true;
                console.log('Chefe spawnado!');
            }

            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.update(deltaTime);

                const dx = enemy.x - this.player.x;
                const dy = enemy.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < (enemy.hitboxWidth + this.player.width) / 2) {
                    if (Date.now() - enemy.lastDamageTime >= enemy.damageInterval) {
                        enemy.lastDamageTime = Date.now();
                        if (this.player.takeDamage(enemy.damage)) {
                            this.gameState.gameOver = true;
                        }
                    }
                }
            }

            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const projectile = this.projectiles[i];
                projectile.update(deltaTime);
                
                const margin = 300;
                if (projectile.x < -margin || projectile.x > this.canvas.width + margin ||
                    projectile.y < -margin || projectile.y > this.canvas.height + margin ||
                    projectile.distanceTraveled > projectile.range) {
                    this.projectiles.splice(i, 1);
                    continue;
                }

                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    const dx = projectile.x - enemy.x;
                    const dy = projectile.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < (enemy.hitboxWidth + projectile.width) / 2) {
                        if (enemy.takeDamage(projectile.damage)) {
                            if (enemy.isBoss && !this.gameState.bossDefeated) {
                                this.gameState.bossDefeated = true;
                                const powerup = new PowerUp(enemy.x, enemy.y, 'pierce');
                                this.powerups.push(powerup);
                                console.log('Power-up de penetração spawnado!');
                            }
                            this.enemies.splice(j, 1);
                            this.gameState.score += enemy.isBoss ? 300 : 100;
                        }
                        if (!projectile.pierce) {
                            this.projectiles.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            for (let i = this.powerups.length - 1; i >= 0; i--) {
                if (this.powerups[i].update(this.player)) {
                    this.powerups.splice(i, 1);
                }
            }
        }

        if (this.player) {
            this.player.render(this.ctx);
        }
        
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.powerups.forEach(powerup => powerup.render(this.ctx));

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.gameState.score}`, 20, 40);
        

        const totalSeconds = Math.floor(this.gameState.currentTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.ctx.fillText(timeStr, 20, 70);
        
        if (this.gameState.gameOver) {
            this.audio.stopBackgroundMusic();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press F5 to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
        
        requestAnimationFrame(this.gameLoop);
    }
}
