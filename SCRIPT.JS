// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');

// Initialize the presentation
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    setupEventListeners();
});

// Initialize presentation functionality
function initializePresentation() {
    updateProgressBar();
    updateActiveNav();
    
    // Add intersection observer for slide visibility
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const slideObserver = new IntersectionObserver(handleSlideIntersection, observerOptions);
    slides.forEach(slide => {
        slideObserver.observe(slide);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Scroll event for progress bar
    window.addEventListener('scroll', updateProgressBar);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Progress bar functionality
function updateProgressBar() {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / scrollHeight) * 100;
    document.getElementById('progressBar').style.width = Math.min(scrolled, 100) + '%';
}

// Handle slide intersection for navigation updates
function handleSlideIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const slideIndex = Array.from(slides).indexOf(entry.target);
            updateCurrentSlide(slideIndex);
        }
    });
}

// Update current slide and navigation
function updateCurrentSlide(slideIndex) {
    currentSlide = slideIndex;
    updateActiveNav();
}

// Navigation dots functionality
function updateActiveNav() {
    navDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Scroll to specific slide
function scrollToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < slides.length) {
        const targetSlide = slides[slideIndex];
        const offsetTop = targetSlide.offsetTop - 20;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        updateCurrentSlide(slideIndex);
    }
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
    switch(event.key) {
        case 'ArrowDown':
        case 'PageDown':
            event.preventDefault();
            navigateToSlide(currentSlide + 1);
            break;
        case 'ArrowUp':
        case 'PageUp':
            event.preventDefault();
            navigateToSlide(currentSlide - 1);
            break;
        case 'Home':
            event.preventDefault();
            navigateToSlide(0);
            break;
        case 'End':
            event.preventDefault();
            navigateToSlide(slides.length - 1);
            break;
        case 'Escape':
            // Exit fullscreen if in fullscreen mode
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
}

// Navigate to slide with bounds checking
function navigateToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < slides.length) {
        scrollToSlide(slideIndex);
    }
}

// Download functionality for individual slide
function downloadCurrentSlide() {
    if (typeof html2canvas === 'undefined') {
        alert('html2canvas library is required for download functionality');
        return;
    }

    const currentSlideElement = slides[currentSlide];
    if (!currentSlideElement) {
        alert('No slide selected');
        return;
    }

    // Show loading indicator
    showLoadingIndicator();

    // Configure html2canvas options
    const options = {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: currentSlideElement.scrollWidth,
        height: currentSlideElement.scrollHeight
    };

    html2canvas(currentSlideElement, options).then(canvas => {
        hideLoadingIndicator();
        downloadCanvas(canvas, slide-${currentSlide + 1}.png);
    }).catch(error => {
        hideLoadingIndicator();
        console.error('Error capturing slide:', error);
        alert('Error downloading slide. Please try again.');
    });
}

// Download all slides
async function downloadAllSlides() {
    if (typeof html2canvas === 'undefined') {
        alert('html2canvas library is required for download functionality');
        return;
    }

    showLoadingIndicator();

    try {
        const promises = Array.from(slides).map((slide, index) => {
            const options = {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                width: slide.scrollWidth,
                height: slide.scrollHeight
            };