/* ============================================================
   HOUSE OF SAMOSAS — PREMIUM INTERACTIONS ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. NAVIGATION
    // ============================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileCta = document.getElementById('mobileCta');

    // Scroll-based navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show mobile sticky CTA after hero
        if (mobileCta) {
            if (currentScroll > window.innerHeight * 0.8) {
                mobileCta.classList.add('visible');
            } else {
                mobileCta.classList.remove('visible');
            }
        }

        lastScroll = currentScroll;
    });

    // Mobile hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navbar.classList.toggle('menu-active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                navbar.classList.remove('menu-active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // 2. SCROLL ANIMATIONS (Intersection Observer)
    // ============================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============================================================
    // 3. PARALLAX HERO
    // ============================================================
    const heroBgImg = document.querySelector('.hero-bg-img');
    
    if (heroBgImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                const parallax = scrolled * 0.4;
                heroBgImg.style.transform = `scale(1.1) translateY(${parallax}px)`;
            }
        }, { passive: true });
    }

    // ============================================================
    // 4. FLOATING SPICE PARTICLES
    // ============================================================
    const canvas = document.getElementById('spiceParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = -Math.random() * 0.8 - 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
                
                // Warm golden/orange colors
                const colors = [
                    'rgba(201, 168, 76,',    // Gold
                    'rgba(217, 119, 6,',     // Burnt Orange
                    'rgba(245, 158, 11,',    // Warm Yellow
                    'rgba(110, 13, 18,',     // Maroon
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity -= this.fadeSpeed;

                if (this.opacity <= 0 || this.y < -10) {
                    this.reset();
                    this.y = canvas.height + 10;
                    this.opacity = Math.random() * 0.5 + 0.1;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            resizeCanvas();
            particles = [];
            const count = Math.min(60, Math.floor(canvas.width / 20));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animateParticles);
        }

        // Only animate particles when hero is visible
        const heroSection = document.getElementById('hero');
        const particleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationId) animateParticles();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        particleObserver.observe(heroSection);
        initParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // ============================================================
    // 5. REVIEWS SLIDER
    // ============================================================
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('sliderDots');
    let currentReview = 0;
    let autoSlideInterval;

    if (reviewCards.length > 0 && dotsContainer) {
        // Create dots
        reviewCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToReview(i));
            dotsContainer.appendChild(dot);
        });

        function goToReview(index) {
            const prevIndex = currentReview;
            currentReview = index;

            reviewCards.forEach((card, i) => {
                card.classList.remove('active', 'exit-left');
                if (i === prevIndex && i !== currentReview) {
                    card.classList.add('exit-left');
                }
            });

            reviewCards[currentReview].classList.add('active');

            // Update dots
            dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentReview);
            });
        }

        function nextReview() {
            goToReview((currentReview + 1) % reviewCards.length);
        }

        function prevReview() {
            goToReview((currentReview - 1 + reviewCards.length) % reviewCards.length);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextReview();
            resetAutoSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevReview();
            resetAutoSlide();
        });

        // Auto-advance
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextReview, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Pause on hover
        const reviewsSection = document.querySelector('.reviews');
        if (reviewsSection) {
            reviewsSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            reviewsSection.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        const slider = document.getElementById('reviewsSlider');

        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextReview();
                    else prevReview();
                    resetAutoSlide();
                }
            }, { passive: true });
        }
    }

    // ============================================================
    // 6. COUNTER ANIMATION (for stat numbers)
    // ============================================================
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    // ============================================================
    // 7. MOUSE PARALLAX ON HERO (subtle)
    // ============================================================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
        });
    }

    // ============================================================
    // 8. HORIZONTAL SCROLL for Signature cards (drag support)
    // ============================================================
    const track = document.getElementById('signatureTrack');
    if (track) {
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });

        track.style.cursor = 'grab';
    }

    // ============================================================
    // 9. PRELOADER FADE
    // ============================================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        // Trigger hero animations
        document.querySelectorAll('.hero .animate-on-scroll').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 300 + i * 150);
        });
    });

    // ============================================================
    // 10. MENU CARD HOVER TILT (subtle 3D)
    // ============================================================
    document.querySelectorAll('.signature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateX = (y - 0.5) * -8;
            const rotateY = (x - 0.5) * 8;
            
            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ============================================================
    // 11. FEATURE CARD HOVER GLOW FOLLOW
    // ============================================================
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = card.querySelector('.feature-glow');
            if (glow) {
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
                glow.style.transform = 'translate(-50%, -50%)';
            }
        });
    });

    // ============================================================
    // 12. ACTIVE SECTION DETECTION (nav highlight)
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.style.color = '';
                    if (a.getAttribute('href') === `#${id}`) {
                        a.style.color = 'var(--gold-light)';
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
});
