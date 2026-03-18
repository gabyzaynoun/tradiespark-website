/* ============================================
   TradieSpark - Main JavaScript
   Multi-step form, Cloudinary uploads, animations
   ============================================ */

(function () {
  'use strict';

  // ==================== CONFIG ====================
  var CONFIG = {
    email: 'hello@tradiespark.com.au',
    formspreeEndpoint: 'https://formspree.io/f/xovkkogj',
    emailjs: {
      serviceID: 'service_rv0g64q',
      templateID: 'template_zmkps99',
      publicKey: 'lEmk1ZUaQ2U8llIlL'
    },
    cloudinary: {
      cloudName: 'dyqqr7ipc',
      uploadPreset: 'tradiespark'
    }
  };

  // ==================== STATE ====================
  var currentStep = 1;
  var totalSteps = 5;
  var uploadedLogos = [];
  var uploadedPhotos = [];

  // ==================== DOM READY ====================
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initRadioCards();
    initConditionalFields();
    initFormNavigation();
    initFormSubmission();
    initCloudinaryUploads();
    initFaqAccordion();
    initStickyCta();
    initPhoneFormatter();
    initActiveNav();
    initCookieConsent();
    initABTest();
    initPricingCounters();
    initHeroParallax();

    // Initialize EmailJS early so it's ready when the form submits
    if (typeof emailjs !== 'undefined') {
      emailjs.init(CONFIG.emailjs.publicKey);
    }
  }

  // ==================== STICKY HEADER ====================
  function initStickyHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    var links = mobileMenu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
  }

  // ==================== SMOOTH SCROLL ====================
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      });
    }
  }

  // ==================== REVEAL ANIMATIONS ====================
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < reveals.length; i++) {
      observer.observe(reveals[i]);
    }
  }

  // ==================== RADIO CARDS ====================
  function initRadioCards() {
    var groups = document.querySelectorAll('.radio-cards');
    for (var g = 0; g < groups.length; g++) {
      (function (group) {
        var cards = group.querySelectorAll('.radio-card');
        for (var c = 0; c < cards.length; c++) {
          (function (card) {
            var radio = card.querySelector('input[type="radio"]');
            if (!radio) return;

            card.addEventListener('click', function () {
              for (var j = 0; j < cards.length; j++) {
                cards[j].classList.remove('selected');
              }
              card.classList.add('selected');
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
            });

            if (radio.checked) card.classList.add('selected');
          })(cards[c]);
        }
      })(groups[g]);
    }
  }

  // ==================== CONDITIONAL FIELDS ====================
  function initConditionalFields() {
    // Existing website → show URL field
    var existingRadios = document.querySelectorAll('input[name="existing_website"]');
    for (var i = 0; i < existingRadios.length; i++) {
      existingRadios[i].addEventListener('change', function () {
        var urlField = document.getElementById('existingUrlField');
        if (urlField) {
          if (this.value === 'Yes') {
            urlField.classList.add('visible');
          } else {
            urlField.classList.remove('visible');
          }
        }
      });
    }

    // Package → Makeover info box
    var packageRadios = document.querySelectorAll('input[name="package"]');
    for (var j = 0; j < packageRadios.length; j++) {
      packageRadios[j].addEventListener('change', function () {
        var makeoverInfo = document.getElementById('makeoverInfo');
        if (makeoverInfo) {
          if (this.value.indexOf('Makeover') !== -1) {
            makeoverInfo.classList.add('visible');
          } else {
            makeoverInfo.classList.remove('visible');
          }
        }
      });
    }
  }

  // ==================== MULTI-STEP FORM ====================
  function initFormNavigation() {
    var nextBtn = document.getElementById('nextBtn');
    var prevBtn = document.getElementById('prevBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          goToStep(currentStep + 1);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToStep(currentStep - 1);
      });
    }
  }

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    // Hide current step with slide-out animation
    var current = document.querySelector('.form-step[data-step="' + currentStep + '"]');
    if (current) {
      current.classList.add('slide-out');
      setTimeout(function () {
        current.classList.remove('active', 'slide-out');
      }, 250);
    }

    // Show new step with slide-in animation
    var oldStep = currentStep;
    currentStep = step;
    var next = document.querySelector('.form-step[data-step="' + step + '"]');
    setTimeout(function () {
      if (next) {
        next.classList.add('active', 'slide-in');
        setTimeout(function () { next.classList.remove('slide-in'); }, 350);
      }
    }, current ? 250 : 0);

    // Update progress bar
    var bars = document.querySelectorAll('.progress-step');
    for (var i = 0; i < bars.length; i++) {
      var barStep = parseInt(bars[i].getAttribute('data-step'));
      bars[i].classList.remove('active', 'completed');
      if (barStep === currentStep) bars[i].classList.add('active');
      else if (barStep < currentStep) bars[i].classList.add('completed');
    }

    // Update step label
    var label = document.getElementById('currentStepNum');
    if (label) label.textContent = String(currentStep);

    // Update buttons
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var submitBtn = document.getElementById('submitBtn');

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? '' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? '' : 'none';

    // Scroll form into view
    var wrapper = document.querySelector('.form-wrapper');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ==================== FORM VALIDATION ====================
  function validateStep(step) {
    clearErrors();
    var valid = true;

    if (step === 1) {
      if (!validateRequired('fullName', 'fullNameError', 2)) valid = false;
      if (!validateRequired('businessName', 'businessNameError', 2)) valid = false;
      if (!validateEmail('email', 'emailError')) valid = false;
      if (!validatePhone('phone', 'phoneError')) valid = false;
      if (!validateRequired('suburb', 'suburbError', 2)) valid = false;
      if (!validateSelect('tradeType', 'tradeTypeError')) valid = false;
    }

    if (step === 2) {
      if (!validateRadio('package', 'packageError')) valid = false;
      if (!validateRadio('hosting', 'hostingError')) valid = false;
      if (!validateRadio('existing_website', 'existingWebsiteError')) valid = false;
    }

    if (step === 3) {
      if (!validateRequired('businessDesc', 'businessDescError', 10)) valid = false;
      if (!validateRequired('services', 'servicesError', 3)) valid = false;
      if (!validateRequired('serviceAreas', 'serviceAreasError', 2)) valid = false;
    }

    if (step === 4) {
      if (uploadedPhotos.length === 0) {
        showError('photosError');
        valid = false;
      }
    }

    if (step === 5) {
      if (!validateSelect('hearAbout', 'hearAboutError')) valid = false;
    }

    return valid;
  }

  function validateRequired(fieldId, errorId, minLength) {
    var field = document.getElementById(fieldId);
    if (!field) return true;
    var value = field.value.trim();
    if (value.length < (minLength || 1)) {
      showError(errorId);
      field.classList.add('error');
      return false;
    }
    return true;
  }

  function validateEmail(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    if (!field) return true;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(field.value.trim())) {
      showError(errorId);
      field.classList.add('error');
      return false;
    }
    return true;
  }

  function validatePhone(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    if (!field) return true;
    var cleaned = field.value.replace(/[\s\-()]/g, '');
    var re = /^(\+?61|0)[2-478]\d{8}$/;
    if (!re.test(cleaned)) {
      showError(errorId);
      field.classList.add('error');
      return false;
    }
    return true;
  }

  function validateSelect(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    if (!field) return true;
    if (!field.value) {
      showError(errorId);
      field.classList.add('error');
      return false;
    }
    return true;
  }

  function validateRadio(name, errorId) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    if (!checked) {
      showError(errorId);
      return false;
    }
    return true;
  }

  function showError(errorId) {
    var el = document.getElementById(errorId);
    if (el) el.classList.add('visible');
  }

  function clearErrors() {
    var errors = document.querySelectorAll('.form-error');
    for (var i = 0; i < errors.length; i++) {
      errors[i].classList.remove('visible');
    }
    var fields = document.querySelectorAll('.error');
    for (var j = 0; j < fields.length; j++) {
      fields[j].classList.remove('error');
    }
  }

  // ==================== FORM SUBMISSION ====================
  function initFormSubmission() {
    var form = document.getElementById('intakeForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateStep(currentStep)) return;

      var submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Set upload URLs in hidden fields
      document.getElementById('logoUrls').value = uploadedLogos.join(', ');
      document.getElementById('photoUrls').value = uploadedPhotos.join(', ');

      var formData = new FormData(form);

      fetch(CONFIG.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          // Show success
          form.style.display = 'none';
          var progress = document.querySelector('.form-progress');
          var stepLabel = document.querySelector('.form-step-label');
          var formNav = document.querySelector('.form-nav');
          if (progress) progress.style.display = 'none';
          if (stepLabel) stepLabel.style.display = 'none';
          if (formNav) formNav.style.display = 'none';

          var success = document.getElementById('formSuccess');
          if (success) success.classList.add('visible');

          // Send confirmation email to customer via EmailJS
          if (typeof emailjs !== 'undefined') {
            var customerName = formData.get('full_name') || 'there';
            var customerEmail = formData.get('email') || '';
            if (customerEmail) {
              emailjs.send(CONFIG.emailjs.serviceID, CONFIG.emailjs.templateID, {
                from_name: customerName,
                email: customerEmail
              }).then(function() {
                console.log('EmailJS: confirmation sent to ' + customerEmail);
              }).catch(function (err) {
                console.warn('EmailJS send failed:', err);
              });
            }
          }

          // Track conversion
          trackEvent('generate_lead', {
            event_category: 'form',
            event_label: 'intake_form_submitted'
          });
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        alert('Something went wrong. Please try again or email us at ' + CONFIG.email);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get My Website \u2192';
        }
      });
    });
  }

  // ==================== CLOUDINARY UPLOADS ====================
  function initCloudinaryUploads() {
    setupUploadWidget('logoUpload', 'logoPreviews', uploadedLogos, {
      maxFiles: 1,
      folder: 'tradiespark/logos',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'svg', 'pdf']
    });

    setupUploadWidget('photosUpload', 'photosPreviews', uploadedPhotos, {
      maxFiles: 15,
      folder: 'tradiespark/photos',
      clientAllowedFormats: ['jpg', 'jpeg', 'png']
    });
  }

  function setupUploadWidget(triggerId, previewsId, urlArray, options) {
    var trigger = document.getElementById(triggerId);
    var previewsContainer = document.getElementById(previewsId);
    if (!trigger || !previewsContainer) return;

    trigger.addEventListener('click', function () {
      if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        alert('Upload widget is loading. Please try again in a moment.');
        return;
      }

      var widget = cloudinary.createUploadWidget({
        cloudName: CONFIG.cloudinary.cloudName,
        uploadPreset: CONFIG.cloudinary.uploadPreset,
        sources: ['local'],
        multiple: (options.maxFiles || 1) > 1,
        maxFiles: options.maxFiles || 1,
        resourceType: 'image',
        folder: options.folder || 'tradiespark',
        clientAllowedFormats: options.clientAllowedFormats,
        showAdvancedOptions: false,
        cropping: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#FF6B35',
            menuIcons: '#6B7280',
            textDark: '#111827',
            textLight: '#FFFFFF',
            link: '#FF6B35',
            action: '#FF6B35',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#FF6B35',
            complete: '#10B981',
            sourceBg: '#F5F5F5'
          }
        }
      }, function (error, result) {
        if (!error && result && result.event === 'success') {
          var url = result.info.secure_url;
          urlArray.push(url);

          // Create thumbnail preview
          var preview = document.createElement('div');
          preview.className = 'upload-preview';

          var img = document.createElement('img');
          img.src = result.info.thumbnail_url || url;
          img.alt = 'Uploaded file';
          preview.appendChild(img);

          var removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'remove-btn';
          removeBtn.setAttribute('aria-label', 'Remove');
          removeBtn.innerHTML = '&times;';
          removeBtn.addEventListener('click', function () {
            var idx = urlArray.indexOf(url);
            if (idx !== -1) urlArray.splice(idx, 1);
            preview.remove();
          });
          preview.appendChild(removeBtn);

          previewsContainer.appendChild(preview);
        }
      });

      widget.open();
    });
  }

  // ==================== FAQ ACCORDION ====================
  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-question');
    for (var i = 0; i < questions.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.faq-item');
          var answer = item.querySelector('.faq-answer');
          var inner = item.querySelector('.faq-answer-inner');
          var isOpen = item.classList.contains('open');

          // Close all others
          var openItems = document.querySelectorAll('.faq-item.open');
          for (var j = 0; j < openItems.length; j++) {
            if (openItems[j] !== item) {
              openItems[j].classList.remove('open');
              openItems[j].querySelector('.faq-question').setAttribute('aria-expanded', 'false');
              openItems[j].querySelector('.faq-answer').style.maxHeight = '0';
            }
          }

          // Toggle current
          if (isOpen) {
            item.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = '0';
          } else {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = inner.scrollHeight + 'px';
          }
        });
      })(questions[i]);
    }
  }

  // ==================== STICKY CTA ====================
  function initStickyCta() {
    var cta = document.getElementById('stickyCta');
    var closeBtn = document.getElementById('closeSticky');
    var intakeSection = document.getElementById('intake');
    if (!cta) return;

    var dismissedAt = localStorage.getItem('stickyCta_dismissed');
    var isDismissed = dismissedAt && (Date.now() - parseInt(dismissedAt) < 86400000);
    if (isDismissed) return;

    var shown = false;
    window.addEventListener('scroll', function () {
      if (isDismissed) return;

      // Show after 400px scroll
      if (window.scrollY > 400 && !shown) {
        cta.classList.add('visible');
        shown = true;
      }

      // Hide when intake section is visible
      if (intakeSection) {
        var rect = intakeSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          cta.classList.remove('visible');
        } else if (shown) {
          cta.classList.add('visible');
        }
      }
    }, { passive: true });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        cta.classList.remove('visible');
        isDismissed = true;
        localStorage.setItem('stickyCta_dismissed', String(Date.now()));
      });
    }
  }

  // ==================== PHONE FORMATTER ====================
  function initPhoneFormatter() {
    var phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function () {
      var value = this.value.replace(/\D/g, '');

      if (value.startsWith('04') && value.length <= 10) {
        // Mobile: 0400 000 000
        if (value.length > 7) {
          this.value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 10);
        } else if (value.length > 4) {
          this.value = value.slice(0, 4) + ' ' + value.slice(4);
        }
      } else if (value.startsWith('0') && value.length <= 10) {
        // Landline: 02 0000 0000
        if (value.length > 6) {
          this.value = value.slice(0, 2) + ' ' + value.slice(2, 6) + ' ' + value.slice(6, 10);
        } else if (value.length > 2) {
          this.value = value.slice(0, 2) + ' ' + value.slice(2);
        }
      }
    });
  }

  // ==================== ACTIVE NAV ====================
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 100;

      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('active');
            if (navLinks[j].getAttribute('href') === '#' + id) {
              navLinks[j].classList.add('active');
            }
          }
        }
      }
    }, { passive: true });
  }

  // ==================== ANALYTICS ====================
  function trackEvent(eventName, params) {
    try {
      if (typeof gtag === 'function') {
        gtag('event', eventName, params || {});
      }
    } catch (e) {
      // Silently fail
    }
  }

  // ==================== COOKIE CONSENT (Item 12) ====================
  function initCookieConsent() {
    var banner = document.getElementById('cookieBanner');
    var acceptBtn = document.getElementById('acceptCookies');
    var declineBtn = document.getElementById('declineCookies');
    if (!banner) return;

    var consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      grantAnalytics();
      return;
    }
    if (consent === 'declined') return;

    // Show banner after 1.5s delay
    setTimeout(function () {
      banner.classList.add('visible');
    }, 1500);

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'accepted');
        banner.classList.remove('visible');
        grantAnalytics();
        trackEvent('cookie_consent', { action: 'accepted' });
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'declined');
        banner.classList.remove('visible');
      });
    }

    function grantAnalytics() {
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      }
    }
  }

  // ==================== A/B HEADLINE TEST (Item 15) ====================
  function initABTest() {
    var headline = document.getElementById('heroHeadline');
    if (!headline) return;

    var variants = [
      'Get More Jobs With a Website That <span class="accent">Actually Works</span>',
      'Your Trade Deserves a Website That <span class="accent">Brings In Work</span>',
      'Stop Losing Jobs to Tradies With <span class="accent">Better Websites</span>'
    ];

    // Deterministic assignment based on stored variant or random
    var storedVariant = localStorage.getItem('ab_headline');
    var variantIndex;

    if (storedVariant !== null && parseInt(storedVariant) < variants.length) {
      variantIndex = parseInt(storedVariant);
    } else {
      variantIndex = Math.floor(Math.random() * variants.length);
      localStorage.setItem('ab_headline', variantIndex);
    }

    headline.innerHTML = variants[variantIndex];

    // Track which variant was shown
    trackEvent('ab_headline_view', {
      variant: variantIndex,
      headline: variants[variantIndex].replace(/<[^>]*>/g, '')
    });

    // Track conversion when user clicks CTA
    var ctas = document.querySelectorAll('a[href="#intake"]');
    for (var i = 0; i < ctas.length; i++) {
      ctas[i].addEventListener('click', function () {
        trackEvent('ab_headline_click', {
          variant: variantIndex,
          headline: variants[variantIndex].replace(/<[^>]*>/g, '')
        });
      });
    }
  }

  // ==================== PRICING COUNTERS (Item 14) ====================
  function initPricingCounters() {
    var amounts = document.querySelectorAll('.pricing-amount');
    if (!amounts.length) return;

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animateAmount(entries[i].target);
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.5 });

    for (var i = 0; i < amounts.length; i++) {
      observer.observe(amounts[i]);
    }

    function animateAmount(el) {
      var text = el.textContent;
      var match = text.match(/\$([\d,]+)/);
      if (!match) return;

      var target = parseInt(match[1].replace(/,/g, ''));
      var start = 0;
      var duration = 800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        var current = Math.floor(start + (target - start) * eased);
        el.textContent = '$' + current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = text; // Restore exact original text
          el.classList.add('animate');
        }
      }

      requestAnimationFrame(step);
    }
  }

  // ==================== HERO PARALLAX (Item 14) ====================
  function initHeroParallax() {
    var glow = document.querySelector('.hero-glow');
    var hero = document.querySelector('.hero');
    if (!glow || !hero) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var heroHeight = hero.offsetHeight;
      if (scrollY > heroHeight) return;

      var parallax = scrollY * 0.3;
      glow.style.transform = 'translate(-50%, calc(-50% + ' + parallax + 'px))';
    }, { passive: true });
  }

})();
