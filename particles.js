class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createParticle(x, y, color, type = 'collect') {
        const particleCount = type === 'collect' ? 10 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x,
                y,
                color,
                size: Math.random() * 5 + 2,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8,
                life: 1,
                decay: Math.random() * 0.02 + 0.02
            });
        }
    }

    update(ctx) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= particle.decay;
            
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1;
    }
}
