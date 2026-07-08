// js/intro.js - 5% Precision Reveal Intro Animation

document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const counterElement = document.getElementById('moisture-counter');
    const ringElement = document.getElementById('ring-effect');
    const heroVisual = document.querySelector('.hero-visual');
    const maskContainers = document.querySelectorAll('.mask-container');
    const heroCta = document.querySelector('.hero-cta');

    // Prevent running if not on homepage (safety check)
    if (!introOverlay) return;

    // Check session storage
    if (sessionStorage.getItem('introPlayed') === 'true') {
        // OPTIMIZATION: Completely remove video/overlay from DOM to free CPU/GPU resources
        if (introOverlay) {
            const video = introOverlay.querySelector('video');
            if (video) video.pause();
            introOverlay.remove();
        }
        if (heroVisual) heroVisual.classList.add('cinematic-sweep', 'sweep-active');
        maskContainers.forEach(c => c.classList.add('revealed'));
        if (heroCta) heroCta.classList.add('revealed');
        return;
    }

    // Lock scrolling
    document.body.style.overflow = 'hidden';

    // Ease Out Quad function
    const easeOutQuad = (t) => t * (2 - t);

    const startVal = 85;
    const endVal = 5;
    const duration = 1200; // Phase 1: 0.0s - 1.2s

    let startTime = null;

    function countUp(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        let percent = Math.min(progress / duration, 1);
        let easedProgress = easeOutQuad(percent);
        
        let currentVal = Math.floor(startVal - (startVal - endVal) * easedProgress);
        
        if (counterElement) {
            counterElement.textContent = currentVal + '%';
        }

        if (progress < duration) {
            requestAnimationFrame(countUp);
        } else {
            // Phase 2: The Lock (1.2s - 1.8s)
            if (counterElement) {
                counterElement.textContent = '5%';
                counterElement.classList.add('locked-green');
            }
            if (ringElement) {
                ringElement.classList.add('ring-expand');
            }

            // Phase 3: The Reveal (1.8s - 3.5s)
            setTimeout(() => {
                if (introOverlay) {
                    introOverlay.classList.add('fade-out');
                }
                
                // Trigger cinematic sweep on the machine
                if (heroVisual) {
                    heroVisual.classList.add('cinematic-sweep', 'sweep-active');
                }

                // Mask in text from bottom up
                maskContainers.forEach(c => c.classList.add('revealed'));
                
                // Fade in CTA slightly after text
                setTimeout(() => {
                    if (heroCta) heroCta.classList.add('revealed');
                }, 400);

                // Restore scrolling and mark played
                setTimeout(() => {
                    document.body.style.overflow = '';
                    sessionStorage.setItem('introPlayed', 'true');
                    
                    // OPTIMIZATION: Completely remove video/overlay from DOM to free CPU/GPU resources
                    if (introOverlay) {
                        const video = introOverlay.querySelector('video');
                        if (video) video.pause();
                        introOverlay.remove();
                    }
                }, 1700); // 1.7s CSS transition fade-out time

            }, 600); // 1.2s + 0.6s wait = 1.8s timestamp
        }
    }

    // Start Phase 1
    requestAnimationFrame(countUp);
});
