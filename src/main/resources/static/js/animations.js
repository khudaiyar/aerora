// Weather Card Animations Manager
class WeatherAnimations {
constructor() {
this.animations = new Map();
}

```
/**
 * Add weather animation to a card
 * @param {HTMLElement} card - The city card element
 * @param {string} condition - Weather condition
 * @param {boolean} isDaytime - Is it daytime
 * @param {number} temp - Temperature
 */
addAnimation(card, condition, isDaytime, temp) {
    // Remove any existing animation
    this.removeAnimation(card);

    // Create animation canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'weather-animation-canvas';
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;

    // Insert canvas
    card.style.position = 'relative';
    card.insertBefore(canvas, card.firstChild);

    const ctx = canvas.getContext('2d');
    const animationId = this.startAnimation(ctx, canvas, condition, isDaytime, temp);

    this.animations.set(card, { canvas, animationId });
}

/**
 * Remove animation from card
 */
removeAnimation(card) {
    const anim = this.animations.get(card);
    if (anim) {
        cancelAnimationFrame(anim.animationId);
        if (anim.canvas && anim.canvas.parentNode) {
            anim.canvas.parentNode.removeChild(anim.canvas);
        }
        this.animations.delete(card);
    }
}

/**
 * Start the appropriate animation
 */
startAnimation(ctx, canvas, condition, isDaytime, temp) {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return this.animateRain(ctx, canvas);
    } else if (conditionLower.includes('snow')) {
        return this.animateSnow(ctx, canvas);
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return this.animateThunderstorm(ctx, canvas);
    } else if (conditionLower.includes('cloud')) {
        return this.animateClouds(ctx, canvas, isDaytime);
    } else if (conditionLower.includes('clear')) {
        return isDaytime ? this.animateSun(ctx, canvas, temp) : this.animateMoon(ctx, canvas);
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        return this.animateFog(ctx, canvas);
    }

    return this.animateDefault(ctx, canvas, isDaytime);
}

/**
 * Animate Rain
 */
animateRain(ctx, canvas) {
    const drops = [];
    for (let i = 0; i < 50; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 15 + 10,
            speed: Math.random() * 3 + 5
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
        ctx.lineWidth = 1;

        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        });

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Snow
 */
animateSnow(ctx, canvas) {
    const flakes = [];
    for (let i = 0; i < 30; i++) {
        flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.5,
            drift: Math.random() * 0.5 - 0.25
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        flakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();

            flake.y += flake.speed;
            flake.x += flake.drift;

            if (flake.y > canvas.height) {
                flake.y = -flake.radius;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;
        });

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Thunderstorm
 */
animateThunderstorm(ctx, canvas) {
    const drops = [];
    for (let i = 0; i < 80; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 15,
            speed: Math.random() * 4 + 8
        });
    }

    let lightningTimer = 0;

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Rain
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.7)';
        ctx.lineWidth = 1.5;

        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        });

        // Lightning flash
        lightningTimer++;
        if (lightningTimer > 100 && Math.random() > 0.97) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lightningTimer = 0;
        }

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Clouds
 */
animateClouds(ctx, canvas, isDaytime) {
    const clouds = [];
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.4),
            width: Math.random() * 60 + 40,
            speed: Math.random() * 0.2 + 0.1
        });
    }

    const cloudColor = isDaytime ? 'rgba(255, 255, 255, 0.4)' : 'rgba(200, 200, 200, 0.3)';

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = cloudColor;

        clouds.forEach(cloud => {
            // Simple cloud shape
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width / 4, cloud.y - cloud.width / 6, cloud.width / 4, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            ctx.fill();

            cloud.x += cloud.speed;
            if (cloud.x > canvas.width + cloud.width) {
                cloud.x = -cloud.width;
            }
        });

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Sun
 */
animateSun(ctx, canvas, temp) {
    let rotation = 0;
    const sunX = canvas.width * 0.8;
    const sunY = canvas.height * 0.3;
    const sunRadius = 25;

    // Color based on temperature
    let sunColor = 'rgba(255, 215, 0, 0.6)';
    if (temp > 30) sunColor = 'rgba(255, 140, 0, 0.7)'; // Hot - orange
    else if (temp < 10) sunColor = 'rgba(255, 235, 150, 0.5)'; // Cold - pale yellow

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sun rays
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(rotation);

        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 * i) / 12);
            ctx.beginPath();
            ctx.moveTo(sunRadius + 5, 0);
            ctx.lineTo(sunRadius + 15, 0);
            ctx.strokeStyle = sunColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();

        // Sun circle
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = sunColor;
        ctx.fill();

        rotation += 0.005;

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Moon
 */
animateMoon(ctx, canvas) {
    const moonX = canvas.width * 0.8;
    const moonY = canvas.height * 0.3;
    const moonRadius = 20;
    let pulse = 0;

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Moon glow
        const glowRadius = moonRadius + Math.sin(pulse) * 3;
        const gradient = ctx.createRadialGradient(moonX, moonY, moonRadius, moonX, moonY, glowRadius + 10);
        gradient.addColorStop(0, 'rgba(220, 220, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');

        ctx.beginPath();
        ctx.arc(moonX, moonY, glowRadius + 10, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Moon
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 240, 255, 0.6)';
        ctx.fill();

        // Stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 10; i++) {
            const x = (moonX / 10) * i;
            const y = (moonY / 10) * i + Math.sin(pulse + i) * 5;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        pulse += 0.02;

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Animate Fog/Mist
 */
animateFog(ctx, canvas) {
    const fogLayers = [];
    for (let i = 0; i < 5; i++) {
        fogLayers.push({
            y: (canvas.height / 5) * i,
            offset: Math.random() * canvas.width,
            speed: Math.random() * 0.3 + 0.2
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fogLayers.forEach(layer => {
            const gradient = ctx.createLinearGradient(0, layer.y, canvas.width, layer.y);
            gradient.addColorStop(0, 'rgba(200, 200, 200, 0)');
            gradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.2)');
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(layer.offset, layer.y, canvas.width, canvas.height / 5);

            layer.offset += layer.speed;
            if (layer.offset > canvas.width) {
                layer.offset = -canvas.width;
            }
        });

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Default animation (gentle particles)
 */
animateDefault(ctx, canvas, isDaytime) {
    const particles = [];
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    const particleColor = isDaytime ? 'rgba(255, 255, 255, 0.3)' : 'rgba(200, 200, 255, 0.3)';

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = particleColor;

        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });

        return requestAnimationFrame(animate);
    };

    return animate();
}

/**
 * Clean up all animations
 */
cleanupAll() {
    this.animations.forEach((anim, card) => {
        this.removeAnimation(card);
    });
}
```

}

// Create global instance
const weatherAnimations = new WeatherAnimations();

console.log(‘✅ Weather animations loaded’);

// ---------------------------------------------------------
// Typewriter animation for app subtitle
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.app-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    const typingSpeed = 100; // ms per character
    const displayDuration = 10000; // 10 seconds visible

    function typeWriter() {
        subtitle.textContent = '';
        let i = 0;

        const typingInterval = setInterval(() => {
            subtitle.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typingInterval);
                setTimeout(typeWriter, displayDuration);
            }
        }, typingSpeed);
    }

    typeWriter();
});