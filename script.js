// TradieSpark JavaScript - Interactive Functionality

// ============================================
// DOM Ready Handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('TradieSpark Website Loaded');
    
    // Initialize all modules
    initFormHandler();
    initSmoothScrolling();
    initStickyHeader();
    initPhoneFormatter();
    initAnimations();
    initAccessibility();
    initAnalytics();
});

// ============================================
// Form Submission Handler
// ============================================
function initFormHandler() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    // Hide any existing messages
    if (successMsg) successMsg.classList.remove('show');
    if (errorMsg) errorMsg.classList.remove('show');
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!validateForm(data)) {
        if (errorMsg) {
            errorMsg.textContent = 'Please fill in all required fields correctly.';
            errorMsg.classList.add('show');
        }
        return;
    }
    
    // Add loading state
    form.classList.add('loading');
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    // In production, replace this with actual API call
    sendFormData(data)
        .then(() => {
            // Show success message
            if (successMsg) {
                successMsg.classList.add('show');
            }
            
            // Reset form
            form.reset();
            
            // Track conversion
            trackEvent('form_submission', {
                form_name: 'quote_request',
                job_type: data.jobType
            });
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch((error) => {
            // Show error message
            if (errorMsg) {
                errorMsg.textContent = 'Sorry, something went wrong. Please try again or call us directly.';
                errorMsg.classList.add('show');
            }
            console.error('Form submission error:', error);
        })
        .finally(() => {
            // Remove loading state
            form.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Form validation
function validateForm(data) {
    // Check required fields
    if (!data.name || !data.phone || !data.suburb) {
        return false;
    }
    
    // Validate phone number (Australian format)
    const phoneRegex = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
    const cleanPhone = data.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        return false;
    }
    
    // Validate name (at least 2 characters)
    if (data.name.trim().length < 2) {
        return false;
    }
    
    return true;
}

// Send form data (replace with actual API endpoint)
function sendFormData(data) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            console.log('Form submitted:', data);
            
            // In production, replace with:
            // return fetch('https://your-api-endpoint.com/quotes', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // });
            
            resolve();
        }, 1500);
    });
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScrolling() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', href);
            }
        });
    });
}

// Scroll to quote form
function scrollToQuote() {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Make function globally available
window.scrollToQuote = scrollToQuote;

// ============================================
// Sticky Header (Mobile)
// ============================================
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Only apply on mobile
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
        } else {
            // Reset on desktop
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', updateHeader);
}

// ============================================
// Phone Number Formatter
// ============================================
function initPhoneFormatter() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        
        // Format as: 0400 000 000 or 02 0000 0000
        if (value.startsWith('04')) {
            // Mobile format
            if (value.length <= 4) {
                formatted = value;
            } else if (value.length <= 7) {
                formatted = value.slice(0, 4) + ' ' + value.slice(4);
            } else {
                formatted = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 10);
            }
        } else {
            // Landline format
            if (value.length <= 2) {
                formatted = value;
            } else if (value.length <= 6) {
                formatted = value.slice(0, 2) + ' ' + value.slice(2);
            } else {
                formatted = value.slice(0, 2) + ' ' + value.slice(2, 6) + ' ' + value.slice(6, 10);
            }
        }
        
        e.target.value = formatted;
    });
    
    // Validate on blur
    phoneInput.addEventListener('blur', function(e) {
        const value = e.target.value.replace(/\s/g, '');
        const phoneRegex = /^(\+?61|0)[2-478](?:[0-9]){8}$/;
        
        if (value && !phoneRegex.test(value)) {
            phoneInput.classList.add('error');
            showFieldError(phoneInput, 'Please enter a valid Australian phone number');
        } else {
            phoneInput.classList.remove('error');
            hideFieldError(phoneInput);
        }
    });
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    hideFieldError(field);
    
    // Create error element
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = 'var(--error)';
    error.style.fontSize = '14px';
    error.style.marginTop = '4px';
    error.style.display = 'block';
    
    // Insert after field
    field.parentNode.appendChild(error);
}

// Hide field error
function hideFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

// ============================================
// Animations (Intersection Observer)
// ============================================
function initAnimations() {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.service-tile, .testimonial-card, .trust-bar, .hero-content'
    );
    
    animateElements.forEach(el => {
        // Add initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        observer.observe(el);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// Accessibility Features
// ============================================
function initAccessibility() {
    // Keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
        // ESC key handler
        if (e.key === 'Escape') {
            // Close any open modals/menus
            closeAllModals();
        }
        
        // Tab trap for modals (if implemented)
        if (e.key === 'Tab') {
            handleTabTrap(e);
        }
    });
    
    // Announce form errors to screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
    
    // Focus management
    manageFocus();
}

// Manage focus for better keyboard navigation
function manageFocus() {
    // Add focus styles dynamically
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .focus-visible:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(focusStyle);
    
    // Polyfill for :focus-visible
    document.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });
    
    document.addEventListener('keydown', () => {
        document.body.classList.remove('using-mouse');
    });
}

// Close all modals (placeholder for future modal implementation)
function closeAllModals() {
    const modals = document.querySelectorAll('.modal.open');
    modals.forEach(modal => {
        modal.classList.remove('open');
    });
}

// Tab trap handler (for future modal implementation)
function handleTabTrap(e) {
    const modal = document.querySelector('.modal.open');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
    }
}

// ============================================
// Analytics Tracking
// ============================================
function initAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track CTA clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent,
                button_type: this.classList.contains('btn-primary') ? 'primary' : 'secondary'
            });
        });
    });
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                phone_number: this.href.replace('tel:', '')
            });
        });
    });
    
    // Track scroll depth
    trackScrollDepth();
}

// Track custom events (integrate with Google Analytics or other service)
function trackEvent(eventName, parameters) {
    // Google Analytics 4 implementation
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Console log for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Analytics Event:', eventName, parameters);
    }
}

// Track scroll depth
function trackScrollDepth() {
    const depths = [25, 50, 75, 90, 100];
    const tracked = new Set();
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round(
            (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
        );
        
        depths.forEach(depth => {
            if (scrollPercent >= depth && !tracked.has(depth)) {
                tracked.add(depth);
                trackEvent('scroll_depth', {
                    percent: depth
                });
            }
        });
    }, 500));
}

// ============================================
// Utility Functions
// ============================================

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// ============================================
// Performance Optimizations
// ============================================

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Preload critical resources
function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
}

preloadResources();

// ============================================
// Service Worker Registration (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
    
    // Track JavaScript errors
    trackEvent('javascript_error', {
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e);
    
    trackEvent('promise_rejection', {
        reason: e.reason
    });
});

// ============================================
// Development Helpers
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%cTradieSpark Development Mode', 'color: #0B5FFF; font-size: 20px; font-weight: bold;');
    console.log('Form validation:', 'active');
    console.log('Smooth scrolling:', 'enabled');
    console.log('Analytics:', 'console mode');
    
    // Add grid overlay for development
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'g') {
            document.body.classList.toggle('show-grid');
        }
    });
    
    // Add responsive size indicator
    const sizeIndicator = document.createElement('div');
    sizeIndicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 9999;
    `;
    
    function updateSizeIndicator() {
        sizeIndicator.textContent = `${window.innerWidth} × ${window.innerHeight}`;
    }
    
    updateSizeIndicator();
    window.addEventListener('resize', updateSizeIndicator);
    document.body.appendChild(sizeIndicator);
}