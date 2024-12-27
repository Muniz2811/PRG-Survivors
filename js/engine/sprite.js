class Sprite {
    constructor(imagePath, width, height, frameCount, animationSpeed) {
        this.image = new Image();
        this.image.src = imagePath;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.animationSpeed = animationSpeed;
        this.animationTimer = 0;
        this.flipped = false;
    }

    update(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.animationTimer = 0;
        }
    }

    setFlipped(flipped) {
        this.flipped = flipped;
    }

    draw(ctx, x, y, width, height) {
        if (!this.image.complete) return;

        const frameX = this.currentFrame * this.width;
        
        ctx.save();
        if (this.flipped) {
            ctx.translate(x + width, y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                frameX, 0, this.width, this.height,
                0, 0, width, height
            );
        } else {
            ctx.drawImage(
                this.image,
                frameX, 0, this.width, this.height,
                x, y, width, height
            );
        }
        ctx.restore();
    }
}
