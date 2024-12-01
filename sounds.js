class SoundManager {
    constructor() {
        this.sounds = {
            collect: new Audio('sounds/collect.mp3'),
            bonus: new Audio('sounds/bonus.mp3'),
            explosion: new Audio('sounds/explosion.mp3'),
            powerup: new Audio('sounds/powerup.mp3'),
            gameOver: new Audio('sounds/gameover.mp3'),
            background: new Audio('sounds/background.mp3')
        };
        
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.3;
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
