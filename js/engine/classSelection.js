class ClassSelection {
    constructor(game) {
        this.game = game;
        this.selectedClass = {
            name: 'Mago',
            description: 'Lança bolas de fogo à distância',
            weapon: 'staff',
            color: '#4B0082'
        };
    }

    update() {
        if (this.game.input.isKeyPressed('Enter')) {
            this.selectClass();
        }
    }

    selectClass() {
        this.game.startGame(this.selectedClass);
    }

    render(ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        const centerX = this.game.canvas.width / 2;
        const centerY = this.game.canvas.height / 2;

        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PRG Survivors', centerX, centerY - 150);

        ctx.fillStyle = '#222';
        ctx.fillRect(centerX - 120, centerY - 100, 240, 200);

        ctx.fillStyle = this.selectedClass.color;
        ctx.font = '24px Arial';
        ctx.fillText(this.selectedClass.name, centerX, centerY - 50);

        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(this.selectedClass.description, centerX, centerY);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Pressione Enter para começar', centerX, centerY + 150);
    }
}
