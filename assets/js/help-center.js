
function initHelpCenter() {

    const categories = document.querySelectorAll('.help-cat');
    const faqPanels = document.querySelectorAll('[id^="faqs-"]');

    const isMobile = () => window.innerWidth <= 767;

    const defaultCategory = 'start';

    // Store original FAQ panel positions
    const originalPositions = new Map();

    faqPanels.forEach(panel => {
        originalPositions.set(panel, {
            parent: panel.parentNode,
            nextSibling: panel.nextSibling
        });

        panel.style.display = 'none';
        panel.classList.remove('mobile-faq-active');
    });

    function closeAllPanels() {

        faqPanels.forEach(panel => {
            panel.style.display = 'none';
            panel.classList.remove('mobile-faq-active');
        });

        categories.forEach(category => {
            category.classList.remove('active-cat');
        });
    }

    function selectCategory(categoryElement) {

        const category = categoryElement.id.replace('cat-', '');
        const targetPanel = document.getElementById('faqs-' + category);

        if (!targetPanel) return;

        // If the selected category is already open on mobile,
        // clicking it again closes it.
        if (
            isMobile() &&
            categoryElement.classList.contains('active-cat')
        ) {
            closeAllPanels();
            return;
        }

        closeAllPanels();

        categoryElement.classList.add('active-cat');

        if (isMobile()) {

            // Move FAQ panel directly below its category
            categoryElement.insertAdjacentElement(
                'afterend',
                targetPanel
            );

            targetPanel.style.display = 'block';
            targetPanel.classList.add('mobile-faq-active');

        } else {

            // Desktop: restore FAQ panel to its original position
            const original = originalPositions.get(targetPanel);

            if (original && original.parent) {

                if (
                    original.nextSibling &&
                    original.nextSibling.parentNode === original.parent
                ) {
                    original.parent.insertBefore(
                        targetPanel,
                        original.nextSibling
                    );
                } else {
                    original.parent.appendChild(targetPanel);
                }
            }

            targetPanel.style.display = 'block';
        }
    }

    // Default category
    const defaultButton = document.getElementById(
        'cat-' + defaultCategory
    );

    if (defaultButton) {
        selectCategory(defaultButton);
    }

    // Category click handler
    document.addEventListener('click', function(event) {

        const clickedCategory = event.target.closest('.help-cat');

        if (!clickedCategory) return;

        event.preventDefault();

        selectCategory(clickedCategory);

    });

    // Restore desktop/mobile layout when screen size changes
    let previousMobileState = isMobile();

    window.addEventListener('resize', function() {

        const currentMobileState = isMobile();

        if (currentMobileState === previousMobileState) return;

        previousMobileState = currentMobileState;

        const activeCategory = document.querySelector(
            '.help-cat.active-cat'
        );

        if (activeCategory) {

            // Reapply the active category in the new layout
            const category = activeCategory.id.replace('cat-', '');
            const targetPanel = document.getElementById('faqs-' + category);

            if (!targetPanel) return;

            if (currentMobileState) {

                activeCategory.insertAdjacentElement(
                    'afterend',
                    targetPanel
                );

                targetPanel.style.display = 'block';
                targetPanel.classList.add('mobile-faq-active');

            } else {

                const original = originalPositions.get(targetPanel);

                if (original && original.parent) {

                    if (
                        original.nextSibling &&
                        original.nextSibling.parentNode === original.parent
                    ) {
                        original.parent.insertBefore(
                            targetPanel,
                            original.nextSibling
                        );
                    } else {
                        original.parent.appendChild(targetPanel);
                    }
                }

                targetPanel.classList.remove('mobile-faq-active');
                targetPanel.style.display = 'block';
            }
        }
    });
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initHelpCenter
    );
} else {
    initHelpCenter();
}
