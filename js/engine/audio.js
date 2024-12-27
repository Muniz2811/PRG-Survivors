class AudioManager {
    constructor() {
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.backgroundMusic = null;
        this.sounds = {};
        
        // Carregar música de fundo
        this.backgroundMusic = new Audio('assets/sounds/bgs.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
    }
    
    playBackgroundMusic() {
        if (this.backgroundMusic) {
            // Necessário devido às políticas de autoplay dos navegadores
            this.backgroundMusic.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    loadSound(name, path) {
        this.sounds[name] = new Audio(path);
        this.sounds[name].volume = this.sfxVolume;
    }
    
    playSound(name) {
        if (this.sounds[name]) {
            // Cria um clone do som para permitir sobreposição
            const sound = this.sounds[name].cloneNode();
            sound.volume = this.sfxVolume;
            sound.play().catch(error => {
                console.log("Sound play prevented:", error);
            });
        }
    }
}
