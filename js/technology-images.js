// js/technology-images.js

(function() {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('Missing GSAP dependencies');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initScrollSequence();

    function initScrollSequence() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: self => updateWayfinding(self.progress)
            }
        });

        const imgFrontClosed = document.getElementById('machine-front-closed');
        const imgFrontOpen = document.getElementById('machine-front-open');
        const imgAngledOpen = document.getElementById('machine-angled-open');

        // ── Phase 1: Teardown (0% to 40% of scroll) ──
        
        // 1. Crossfade to Open Machine
        tl.to(imgFrontClosed, { opacity: 0, duration: 1, ease: 'none' }, 0.5);
        tl.to(imgFrontOpen, { opacity: 1, duration: 1, ease: 'none' }, 0.5);

        // 2. UI Cards fade in
        tl.to('.card-shell', { autoAlpha: 1, x: 20, duration: 0.5 }, 1.0);
        tl.to('.card-foam', { autoAlpha: 1, x: 20, duration: 0.5 }, 1.2);
        tl.to('.card-trays', { autoAlpha: 1, x: -20, duration: 0.5 }, 1.4);

        // ── Phase 2: Thermal Dynamics Engine (40% to 70% of scroll) ──

        // 1. UI Cards fade out
        tl.to(['.card-shell', '.card-foam', '.card-trays'], { autoAlpha: 0, duration: 0.5 }, 2.5);

        // 2. Crossfade to Angled View
        tl.to(imgFrontOpen, { opacity: 0, duration: 1, ease: 'none' }, 3);
        tl.to(imgAngledOpen, { opacity: 1, duration: 1, ease: 'none' }, 3);

        // Fade in thermal UI card
        tl.fromTo('.thermal-card', 
            { autoAlpha: 0, y: 50 }, 
            { autoAlpha: 1, y: 0, duration: 0.5 }, 
            4
        );
        tl.to('.thermal-card', { autoAlpha: 0, duration: 0.5 }, 5);
        
        // ── Phase 3 & 4: Outro to standard DOM (70% to 100%) ──
        // Hide machine images as we scroll to the CTA
        tl.to('#image-sequence-container', {
            opacity: 0,
            duration: 1,
            ease: 'power2.in'
        }, 5.5);
    }

    function updateWayfinding(progress) {
        // Map 0-1 progress to 5 steps
        const totalSteps = 5;
        const currentStep = Math.min(totalSteps, Math.max(1, Math.ceil(progress * totalSteps)));
        
        document.querySelectorAll('.progress-step').forEach((el, index) => {
            if (index + 1 === currentStep) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        const fillEl = document.querySelector('.progress-fill');
        if (fillEl) {
            fillEl.style.height = `${progress * 100}%`;
        }
    }

})();
