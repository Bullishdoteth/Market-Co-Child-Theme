// Age Gate Sub-question Highlighting
(function() {
    function highlightAge() {
        const challenge = document.querySelector('.age-gate__challenge');
        if (challenge && !challenge.querySelector('.age-highlight')) {
            challenge.innerHTML = challenge.innerHTML.replace(/\b(\d+)\b/, '<span class="age-highlight">$1</span>');
        }
    }
    // Run on load and watch for dynamic popup rendering
    document.addEventListener("DOMContentLoaded", highlightAge);
    const observer = new MutationObserver(highlightAge);
    observer.observe(document.body, { childList: true, subtree: true });
})();
