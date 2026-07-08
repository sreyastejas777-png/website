// js/hero-sequence.js

document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    if (!introOverlay) return;

    // Elements
    const heroVideo = document.querySelector('.hero-video');
    const introTitle = document.getElementById('intro-title');
    
    // Main website UI elements to reveal after intro
    const uiElements = Array.from(document.querySelectorAll('.hero-ui-reveal')).filter(el => el !== introTitle);
    const hotspots = document.querySelectorAll('.hero-visual .hotspot');
    const handwrittenNote = document.querySelector('.hero-visual .handwritten-note');
    
    const interactiveElements = [...hotspots];
    if (handwrittenNote) interactiveElements.push(handwrittenNote);

    // Initial state setup for interactive elements
    interactiveElements.forEach(el => {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none'; // Prevent interaction until revealed
    });

    const HAS_PLAYED = sessionStorage.getItem('heroEntrancePlayed') === 'true';
    let sequenceAborted = false;
    let sequenceTimeouts = [];

    // Function to set the hero section to its final resolved state instantly
    function resolveToFinalState() {
        if (heroVideo) heroVideo.pause();
        introOverlay.style.display = 'none';
        
        uiElements.forEach(el => {
            el.classList.add('revealed-instant');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        
        interactiveElements.forEach(el => {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.transition = 'opacity 0.3s ease-out';
        });
        
        document.body.style.overflow = '';
        sessionStorage.setItem('heroEntrancePlayed', 'true');
        window.dispatchEvent(new CustomEvent('heroIntroComplete'));
    }

    if (HAS_PLAYED) {
        resolveToFinalState();
        return;
    }

    // Abort Sequence on Interaction (Non-Blocking Rule)
    function abortSequence(e) {
        if (e && e.type === 'mousemove') {
            if (e.buttons === 0) return; 
        }
        if (sequenceAborted) return;
        sequenceAborted = true;
        
        sequenceTimeouts.forEach(clearTimeout);
        removeInteractionListeners();
        resolveToFinalState();
    }

    function removeInteractionListeners() {
        window.removeEventListener('wheel', abortSequence, true);
        window.removeEventListener('touchstart', abortSequence, true);
        window.removeEventListener('mousedown', abortSequence, true);
        window.removeEventListener('keydown', abortSequence, true);
        window.removeEventListener('scroll', abortSequence, true);
    }

    window.addEventListener('wheel', abortSequence, { passive: true, capture: true });
    window.addEventListener('touchstart', abortSequence, { passive: true, capture: true });
    window.addEventListener('mousedown', abortSequence, { passive: true, capture: true });
    window.addEventListener('keydown', abortSequence, { passive: true, capture: true });
    window.addEventListener('scroll', abortSequence, { passive: true, capture: true });

    document.body.style.overflow = 'hidden';

    // Begin Animation Timeline
    sequenceTimeouts.push(setTimeout(() => {
        if (sequenceAborted) return;
        
        // Phase 1: Mechanical Opening (0.0s - 3.0s)
        if (heroVideo) {
            heroVideo.currentTime = 0;
            
            // Wait for the video to be fully buffered to prevent jittery playback!
            const startVideo = () => {
                // Sync the appearance of the background and the video exactly when the first frame renders
                heroVideo.addEventListener('playing', () => {
                    if (introOverlay) introOverlay.classList.add('video-ready');
                }, { once: true });

                const playPromise = heroVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('Video autoplay blocked.', e);
                        heroVideo.muted = true;
                        heroVideo.play().then(() => {
                            if (introOverlay) introOverlay.classList.add('video-ready');
                        });
                    });
                }
            };

            if (heroVideo.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                startVideo();
            } else {
                heroVideo.addEventListener('canplay', startVideo, { once: true });
                
                // Fallback in case the event never fires
                setTimeout(() => {
                    if (heroVideo.readyState < 3) startVideo();
                }, 1000);
            }
        }

        // Phase 2: The Industrial Dissolve (4.5s)
        sequenceTimeouts.push(setTimeout(() => {
            if (sequenceAborted) return;
            if (heroVideo) {
                heroVideo.classList.add('video-dissolve');
                setTimeout(() => { if(heroVideo) heroVideo.pause(); }, 1200);
            }

            // Phase 3: The Linear Light Mask Reveal (4.5s)
            if (introTitle) introTitle.classList.add('mask-sweep');

            // Phase 4: Fade Out Overlay & Reveal Website (6.5s)
            sequenceTimeouts.push(setTimeout(() => {
                if (sequenceAborted) return;
                
                introOverlay.classList.add('intro-fade-out');

                // Reveal UI Elements of Main Website
                uiElements.forEach((el, index) => {
                    sequenceTimeouts.push(setTimeout(() => {
                        if (sequenceAborted) return;
                        el.classList.add('ui-revealed');
                    }, index * 200)); 
                });

                // Unlock interaction at T=8.0s (1.5s after fade out starts)
                const totalUIDelay = Math.max(0, (uiElements.length * 200));
                sequenceTimeouts.push(setTimeout(() => {
                    if (sequenceAborted) return;
                    
                    introOverlay.style.display = 'none'; // fully remove it

                    interactiveElements.forEach(el => {
                        el.style.opacity = '1';
                        el.style.pointerEvents = 'auto';
                        el.style.transition = 'opacity 0.8s ease-in';
                    });
                    
                    document.body.style.overflow = '';
                    sessionStorage.setItem('heroEntrancePlayed', 'true');
                    removeInteractionListeners();
                    window.dispatchEvent(new CustomEvent('heroIntroComplete'));
                }, totalUIDelay + 600));

            }, 2000)); // Delay after Title Card Reveal (4.5s to 6.5s = 2.0s)

        }, 4500)); // Wait for Phase 1 Video to finish (4.5s)

    }, 100));
});
