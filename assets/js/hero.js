(() => {
    function initMarketcoHero() {
        const hero = document.getElementById('marketcoHero');

        if (!hero || hero.dataset.initialized === 'true') {
            return;
        }

        const track = hero.querySelector('#marketcoTrack');
        const dotsContainer = hero.querySelector('#marketcoDots');

        if (!track || !dotsContainer) {
            console.warn('MarketCo Hero: Track or dots container not found.');
            return;
        }

        const slides = Array.from(track.querySelectorAll('.marketco-slide'));

        if (slides.length === 0) {
            console.warn('MarketCo Hero: No slides found.');
            return;
        }

        hero.dataset.initialized = 'true';

        let currentIndex = 0;
        let timer = null;

        // Swipe and drag state
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let isHorizontalSwipe = false;

        const swipeThreshold = 50;

        // Create navigation dots
        dotsContainer.innerHTML = '';

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');

            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoplay();
            });

            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        // Navigate to a slide
        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            track.style.transform =
                `translate3d(-${currentIndex * 100}%, 0, 0)`;

            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;

                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        // Autoplay controls
        function stopAutoplay() {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();

            if (slides.length < 2) {
                return;
            }

            timer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        // Begin swipe or drag
        function handleDragStart(x, y) {
            startX = x;
            startY = y;
            isDragging = true;
            isHorizontalSwipe = false;

            stopAutoplay();
        }

        // Detect horizontal movement
        function handleDragMove(x, y, event) {
            if (!isDragging) return;

            const diffX = x - startX;
            const diffY = y - startY;

            // Wait until movement direction is clear
            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                    return;
                }

                // Allow normal vertical page scrolling
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    isDragging = false;
                    startAutoplay();
                    return;
                }

                isHorizontalSwipe = true;
            }

            // Prevent page movement during a horizontal swipe
            if (event && event.cancelable) {
                event.preventDefault();
            }
        }

        // Finish swipe or drag
        function handleDragEnd(x) {
            if (!isDragging) return;

            const diffX = x - startX;

            if (isHorizontalSwipe && Math.abs(diffX) >= swipeThreshold) {
                if (diffX < 0) {
                    // Swipe left: next slide
                    goToSlide(currentIndex + 1);
                } else {
                    // Swipe right: previous slide
                    goToSlide(currentIndex - 1);
                }
            }

            isDragging = false;
            isHorizontalSwipe = false;

            startAutoplay();
        }

        // Touch support
        hero.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            handleDragStart(touch.clientX, touch.clientY);
        }, { passive: true });

        hero.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            handleDragMove(touch.clientX, touch.clientY, event);
        }, { passive: false });

        hero.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            handleDragEnd(touch.clientX);
        });

        hero.addEventListener('touchcancel', () => {
            isDragging = false;
            isHorizontalSwipe = false;
            startAutoplay();
        });

        // Mouse drag support
        hero.addEventListener('mousedown', (event) => {
            if (event.button !== 0) return;
            handleDragStart(event.clientX, event.clientY);
        });

        hero.addEventListener('mousemove', (event) => {
            handleDragMove(event.clientX, event.clientY, event);
        });

        hero.addEventListener('mouseup', (event) => {
            handleDragEnd(event.clientX);
        });

        hero.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                isHorizontalSwipe = false;
                startAutoplay();
            }
        });

        // Pause autoplay on hover (desktop)
        hero.addEventListener('mouseenter', stopAutoplay);
        hero.addEventListener('mouseleave', startAutoplay);

        // Pause when browser tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        // Initial state
        goToSlide(0);
        startAutoplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarketcoHero);
    } else {
        initMarketcoHero();
    }
})();
