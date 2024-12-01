const powerUpTypes = {
    magnet: { 
        emoji: '🧲', 
        points: 0, 
        probability: 0.03,
        duration: 300,
        effect: (game) => {
            game.magnetActive = true;
            game.magnetTimer = 300;
        }
    },
    multiball: { 
        emoji: '🌟', 
        points: 2, 
        probability: 0.03,
        duration: 300,
        effect: (game) => {
            game.multiballActive = true;
            game.multiballTimer = 300;
        }
    },
    shield: { 
        emoji: '🛡️', 
        points: 0, 
        probability: 0.02,
        duration: 300,
        effect: (game) => {
            game.shieldActive = true;
            game.shieldTimer = 300;
        }
    }
}; 