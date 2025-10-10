// TradieSpark JavaScript - Complete Interactive Functionality

// ============================================
// Configuration & Initialization
// ============================================
let config = window.BUSINESS_CONFIG || {
    businessName: "TradieSpark",
    phone: "0412345678",
    phoneDisplay: "0412 345 678",
    email: "hello@tradiespark.com.au",
    abn: "12 345 678 901",
    licence: "123456",
    serviceAreas: ["Parramatta", "Blacktown", "Penrith", "All of Sydney"],
    formBackend: "formspree",
    formspreeCode: "YOUR_FORMSPREE_ID",
    googleAnalyticsID: "G-XXXXXXXXXX",
    facebookPixelID: ""
};

// DOM Ready Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('TradieSpark Website Loaded');
    
    // Initialize all modules
    populateBusinessInfo();
    initAnalytics();
    initFormHandler();
    initSmoothScrolling();
    initStickyHeader();
    initPhoneFormatter();
    initAnimations();
    initClickTracking();
});

// ============================================
// Populate Business Information
// ============================================
function populateBusinessInfo() {
    // Phone numbers
    const phoneElements = document.querySelectorAll('#headerCallBtn, #mobileCTA, #footerPhone');
    phoneElements.forEach(el => {
        el.href = `tel:${config.phone}`;
        if (el.textContent.includes('0')) {
            el.textContent = el.textContent.replace(/\d[\d\s]+/, config.phoneDisplay);
        }
    });
    
    // Phone display
    const phoneDisplay = document.getElementById('phoneDisplay');
    if (phoneDisplay) phoneDisplay.textContent = config.phoneDisplay;
    
    // Email
    const emailElements = document.querySelectorAll('#emailDisplay, #footerEmail');
    emailElements.forEach(el => {
        if (el.tagName === 'A') {
            el.href = `mailto:${config.email}`;
        }
        el.textContent = config.email;
    });
    
    // Business name
    const nameElements = document.querySelectorAll('#footerBusinessName, #footerCopyright');
    nameElements.forEach(el => {
        el.textContent = config.businessName;
    });
    
    // ABN and Licence
    const abnEl = document.getElementById('footerABN');
    if (abnEl) abnEl.textContent = config.abn;
    
    const licenceEl = document.getElementById('footerLicence');
    if (licenceEl) licenceEl.textContent = config.licence;
    
    // Service areas
    const serviceAreasList = document.getElementById('serviceAreasList');
    if (serviceAreasList && config.serviceAreas.length > 0) {
        serviceAreasList.innerHTML = config.serviceAreas
            .map(area => `<li>${area}</li>`)
            .join('');
    }
}

// ============================================
// Analytics Initialization
// ============================================
function initAnalytics() {
    // Load Google Analytics if ID is provided
    if (config.googleAnalyticsID && config.googleAnalyticsID !== 'G-XXXXXXXXXX') {
        loadGoogleAnalytics(config.googleAnalyticsID);
    }
    
    // Load Facebook Pixel if ID is provided
    if (config.facebookPixelID && config.facebookPixelID !== '') {
        loadFacebookPixel(config.facebookPixelID);
    }
    
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track scroll depth
    trackScrollDepth();
}

function loadGoogleAnalytics(measurementId) {
    // Load GA4
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);
    
    window.gtag = window.gtag || function() { dataLayer.push(arguments); };
}

function loadFacebookPixel(pixelId) {
    !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pixelId);
    fbq('track', 'PageView');
}

function trackEvent(eventName, parameters) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // Console log for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Analytics Event:', eventName, parameters);
    }
}

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
                trackEvent('scroll_depth', { percent: depth });
            }
        });
    }, 500));
}

// ============================================
// Form Handling
// ============================================
function initFormHandler() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');
    
    // Hide messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate
    const validation = validateForm(data);
    if (!validation.valid) {
        errorMsg.textContent = validation.message;
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Add loading state
    form.classList.add('loading');
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Submit form
        if (config.formBackend === 'formspree' && config.formspreeCode !== 'YOUR_FORMSPREE_ID') {
            await submitToFormspree(data);
        } else {
            // Demo mode - simulate submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form Data (Demo):', data);
        }
        
        // Success
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.reset();
        
        // Track conversion
        trackEvent('form_submission', {
            form_name: 'quote_request',
            trade_type: data.tradeType
        });
        
        // Facebook Pixel conversion
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        errorMsg.textContent = 'Sorry, something went wrong. Please try again or call us directly.';
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        form.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function validateForm(data) {
    // Check required fields
    if (!data.name || data.name.trim().length < 2) {
        return { valid: false, message: 'Please enter your full name.' };
    }
    
    if (!data.phone) {
        return { valid: false, message: 'Please enter your phone number.' };
    }
    
    // Validate Australian phone number
    const phoneRegex = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
    const cleanPhone = data.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        return { valid: false, message: 'Please enter a valid Australian phone number.' };
    }
    
    if (!data.suburb || data.suburb.trim().length < 2) {
        return { valid: false, message: 'Please enter your suburb.' };
    }
    
    if (!data.tradeType) {
        return { valid: false, message: 'Please select your trade type.' };
    }
    
    return { valid: true };
}

async function submitToFormspree(data) {
    const response = await fetch(`https://formspree.io/f/${config.formspreeCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Form submission failed');
    }
    
    return response.json();
}

// ============================================
// Phone Number Formatting
// ============================================
function initPhoneFormatter() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        
        if (value.startsWith('04')) {
            // Mobile: 0400 000 000
            if (value.length <= 4) {
                formatted = value;
            } else if (value.length <= 7) {
                formatted = value.slice(0, 4) + ' ' + value.slice(4);
            } else {
                formatted = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 10);
            }
        } else {
            // Landline: 02 0000 0000
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
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
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
                
                // Update URL
                history.pushState(null, '', href);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Make globally available
window.scrollToSection = scrollToSection;

// ============================================
// Sticky Header
// ============================================
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Only on mobile
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
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
// Animations (Intersection Observer)
// ============================================
function initAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .process-step, .testimonial-card, .faq-item'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ============================================
// Click Tracking
// ============================================
function initClickTracking() {
    // Track CTA buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                button_class: this.className
            });
        });
    });
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                phone_number: this.href.replace('tel:', ''),
                location: this.id || 'unknown'
            });
        });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('email_click', {
                email: this.href.replace('mailto:', '')
            });
        });
    });
}

// ============================================
// Utility Functions
// ============================================
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

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
    trackEvent('javascript_error', {
        message: e.message,
        source: e.filename,
        line: e.lineno
    });
});

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
    console.log('Config:', config);
    console.log('Form backend:', config.formBackend);
    console.log('Analytics:', config.googleAnalyticsID !== 'G-XXXXXXXXXX' ? 'enabled' : 'disabled');
}