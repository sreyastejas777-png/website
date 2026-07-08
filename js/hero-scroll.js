// js/hero-scroll.js — GSAP ScrollTrigger Scroll-Locked Hero Transition
// State Machine: [CENTERED] → scroll → [SPLITTING] → complete → [SPLIT] → release pin
// Reverse: [SPLIT] → scroll up → [SPLITTING] → complete → [CENTERED]

(function () {
    'use strict';

    const isMobile = () => window.innerWidth < 768;

    function initScrollytelling() {
        // Core elements
        const container = document.getElementById('hero-scroll-container');
        const scene = document.getElementById('hero-scene');
        const centerBlock = document.querySelector('.hero-center-block');
        const videoBlock = document.querySelector('.hero-video-block');
        const video = videoBlock ? videoBlock.querySelector('video') : null;
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const splitStats = document.querySelectorAll('.split-stat');
        const splitCtas = document.querySelectorAll('.split-cta');
        const heroStatsContainer = document.querySelector('.hero-stats-mini');
        const heroCta = document.querySelector('.hero-cta');

        if (!container || !scene || !centerBlock || !videoBlock) {
            console.warn('[HeroScroll] Missing required elements, aborting.');
            return;
        }

        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

        // Build the scroll-driven timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: '+=400%',     // 4 viewport heights of scroll distance to slow it down significantly
                pin: true,
                scrub: 1,          // Elegant smoothing (1 second lag)
                anticipatePin: 1,
                onEnter: () => { if (video) video.play().catch(()=>{}); },
                onLeave: () => { if (video) video.pause(); },
                onEnterBack: () => { if (video) video.play().catch(()=>{}); },
                onLeaveBack: () => { if (video) video.pause(); },
                onUpdate: (self) => {
                    // When fully split, allow natural scrolling
                    if (self.progress === 1) {
                        document.body.classList.add('hero-split-complete');
                    } else {
                        document.body.classList.remove('hero-split-complete');
                    }
                }
            }
        });

        if (isMobile()) {
            // ── MOBILE TIMELINE ──
            // Text slides up to top, video fades in below

            // Phase 1: Text slides up
            tl.to(centerBlock, {
                y: '-15vh',
                duration: 0.6,
                ease: 'none'
            }, 0);

            // Phase 2: Video fades in below
            tl.fromTo(videoBlock, 
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'none' },
                0.2
            );

            // Phase 3: Stats stagger
            splitStats.forEach((stat, i) => {
                tl.fromTo(stat,
                    { opacity: 0.6, y: 10 },
                    { opacity: 1, y: 0, duration: 0.25, ease: 'none' },
                    0.35 + i * 0.06
                );
            });

            // Phase 4: Scroll indicator fades out
            if (scrollIndicator) {
                tl.to(scrollIndicator, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'none'
                }, 0.5);
            }

        } else {
            // ── DESKTOP TIMELINE ──
            // Text slides left, video blends in from right

            // Phase 1 (0% → 60%): Text block translates left
            tl.to(centerBlock, {
                x: () => -(window.innerWidth * 0.25),
                textAlign: 'left',
                duration: 0.6,
                ease: 'none',
                onUpdate: function () {
                    // Progressively shift alignment
                    const progress = this.progress();
                    centerBlock.style.alignItems = progress > 0.3 ? 'flex-start' : 'center';
                }
            }, 0);

            // Phase 2 (20% → 80%): Video fades in + slides from right
            tl.fromTo(videoBlock,
                { opacity: 0, x: 80 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'none' },
                0.15
            );

            // Phase 3 (40% → 90%): Stats stagger into left-aligned grid
            if (heroStatsContainer) {
                tl.to(heroStatsContainer, {
                    borderLeftColor: 'rgba(140, 198, 63, 1)',
                    duration: 0.3,
                    ease: 'none'
                }, 0.35);
            }

            splitStats.forEach((stat, i) => {
                tl.fromTo(stat,
                    { opacity: 0.6, y: 8, x: -5 },
                    { opacity: 1, y: 0, x: 0, duration: 0.2, ease: 'none' },
                    0.4 + i * 0.05
                );
            });

            // Phase 4 (50% → 95%): CTA buttons stagger into position
            splitCtas.forEach((cta, i) => {
                tl.fromTo(cta,
                    { opacity: 0.7, y: 10 },
                    { opacity: 1, y: 0, duration: 0.2, ease: 'none' },
                    0.5 + i * 0.08
                );
            });

            // Phase 5 (80% → 100%): Scroll indicator fades out
            if (scrollIndicator) {
                tl.to(scrollIndicator, {
                    opacity: 0,
                    y: 20,
                    duration: 0.2,
                    ease: 'none'
                }, 0.8);
            }
        }

        // ── PREMIUM 3D ENTRANCE FOR NEXT SECTIONS ──
        // Placed here so it initializes AFTER the 400vh pin is applied to the hero container!
        const statsBar = document.querySelector('.stats-bar');
        let statsBarTransition = null;
        if (statsBar) {
            statsBarTransition = gsap.fromTo(statsBar,
                { y: 120, opacity: 0, rotationX: -15, transformPerspective: 1000 },
                {
                    scrollTrigger: { trigger: statsBar, start: "top 100%", end: "top 70%", scrub: 1 },
                    y: 0, opacity: 1, rotationX: 0, ease: "power2.out"
                }
            );
        }

        const exploreSection = document.querySelector('.explore-section');
        let exploreTransition = null;
        if (exploreSection) {
            exploreTransition = gsap.fromTo(exploreSection,
                { y: 80, opacity: 0, scale: 0.98, transformPerspective: 1000 },
                {
                    scrollTrigger: { trigger: exploreSection, start: "top 95%", end: "top 65%", scrub: 1 },
                    y: 0, opacity: 1, scale: 1, ease: "power2.out"
                }
            );
        }

        // Handle resize: kill and rebuild if breakpoint crosses
        let currentMode = isMobile() ? 'mobile' : 'desktop';
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newMode = isMobile() ? 'mobile' : 'desktop';
                if (newMode !== currentMode) {
                    // Breakpoint crossed — kill and rebuild
                    currentMode = newMode;
                    tl.scrollTrigger.kill();
                    tl.kill();
                    if (statsBarTransition) {
                        if (statsBarTransition.scrollTrigger) statsBarTransition.scrollTrigger.kill();
                        statsBarTransition.kill();
                        gsap.set(statsBar, { clearProps: 'all' });
                    }
                    if (exploreTransition) {
                        if (exploreTransition.scrollTrigger) exploreTransition.scrollTrigger.kill();
                        exploreTransition.kill();
                        gsap.set(exploreSection, { clearProps: 'all' });
                    }
                    // Reset inline styles GSAP may have set
                    gsap.set([centerBlock, videoBlock, scrollIndicator, ...splitStats, ...splitCtas], { clearProps: 'all' });
                    if (heroStatsContainer) gsap.set(heroStatsContainer, { clearProps: 'all' });
                    centerBlock.style.alignItems = '';
                    // Rebuild
                    initScrollytelling();
                } else {
                    ScrollTrigger.refresh();
                }
            }, 250);
        });
    }

    // ── INITIALIZATION ──
    // Wait for intro sequence to complete before activating scrollytelling
    function boot() {
        const introPlayed = sessionStorage.getItem('heroEntrancePlayed') === 'true';

        if (introPlayed) {
            // Intro already played (returning visitor or page refresh)
            // Small delay to let DOM settle
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    initScrollytelling();
                });
            });
        } else {
            // Wait for intro to dispatch completion event
            window.addEventListener('heroIntroComplete', () => {
                // Give a brief moment for CSS transitions to finalize
                setTimeout(() => {
                    initScrollytelling();
                }, 100);
            }, { once: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
