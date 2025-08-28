/**
 * Portfolio - Navigation JavaScript
 * Handles hamburger menu, smooth scrolling, and active navigation states
 */

class PortfolioNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupElements();
    this.bindEvents();
    this.updateActiveNavOnLoad();
  }

  setupElements() {
    // Navigation elements
    this.header = document.querySelector('.header');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.mobileOverlay = document.querySelector('.mobile-overlay');
    this.mobileClose = document.querySelector('.mobile-close');
    this.body = document.body;
    
    // Navigation links
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    this.allNavLinks = [...this.navLinks, ...this.mobileNavLinks];
    
    // Sections for scroll spy
    this.sections = document.querySelectorAll('section[id]');
    
    // Mobile menu state
    this.isMobileMenuOpen = false;
    
    // Throttle scroll events
    this.isScrolling = false;
  }

  bindEvents() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Mobile overlay click to close
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
    }
    
    // Mobile close button
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
    }
    
    // Navigation links smooth scrolling
    this.allNavLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Window scroll events
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // Window resize events
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
    this.hamburger.classList.add('active');
    this.mobileNav.classList.add('active');
    this.mobileOverlay.classList.add('active');
    this.body.classList.add('mobile-menu-open');
    
    // Focus trap for accessibility
    this.trapFocus();
    
    // Animate mobile menu items
    this.animateMobileMenuItems(true);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.hamburger.classList.remove('active');
    this.mobileNav.classList.remove('active');
    this.mobileOverlay.classList.remove('active');
    this.body.classList.remove('mobile-menu-open');
    
    // Animate mobile menu items out
    this.animateMobileMenuItems(false);
  }

  trapFocus() {
    // Simple focus trap for mobile menu
    const focusableElements = this.mobileNav.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  animateMobileMenuItems(isOpening) {
    const items = this.mobileNav.querySelectorAll('.mobile-nav-item');
    
    items.forEach((item, index) => {
      setTimeout(() => {
        if (isOpening) {
          item.style.transform = 'translateX(0)';
          item.style.opacity = '1';
        } else {
          item.style.transform = 'translateX(-20px)';
          item.style.opacity = '0';
        }
      }, index * 50);
    });
  }

  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Check if it's an internal link (starts with #)
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
        
        // Smooth scroll to target
        this.scrollToSection(targetSection);
        
        // Update active states
        this.updateActiveNav(targetId);
        
        // Update URL without causing page jump
        this.updateURL(href);
      }
    }
  }

  scrollToSection(targetSection) {
    const headerHeight = this.header.offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  handleScroll() {
    if (!this.isScrolling) {
      window.requestAnimationFrame(() => {
        this.updateScrollEffects();
        this.updateActiveNavOnScroll();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }
  }

  updateScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header scroll effect
    if (scrollTop > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  updateActiveNavOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = this.header.offsetHeight;
    
    // Find current section
    let currentSection = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Special case for the last section
    if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 100) {
      const lastSection = this.sections[this.sections.length - 1];
      if (lastSection) {
        currentSection = lastSection.getAttribute('id');
      }
    }
    
    // Update active states
    if (currentSection) {
      this.updateActiveNav(currentSection);
    }
  }

  updateActiveNavOnLoad() {
    // Check URL hash on load
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
          this.scrollToSection(targetSection);
          this.updateActiveNav(targetId);
        }, 100);
      }
    } else {
      // Default to home section
      this.updateActiveNav('home');
    }
  }

  updateActiveNav(activeId) {
    // Remove active class from all nav links
    this.allNavLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to matching links
    this.allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  updateURL(hash) {
    // Update URL without causing page jump
    if (history.replaceState) {
      history.replaceState(null, null, hash);
    } else {
      location.hash = hash;
    }
  }

  handleResize() {
    // Close mobile menu on desktop resize
    if (window.innerWidth > 1024 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Public method to scroll to specific section
  scrollTo(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      this.scrollToSection(targetSection);
      this.updateActiveNav(sectionId);
      this.updateURL(`#${sectionId}`);
    }
  }

  // Public method to get current active section
  getCurrentSection() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      const href = activeLink.getAttribute('href');
      return href ? href.substring(1) : null;
    }
    return null;
  }
}

// Utility functions for smooth animations
const AnimationUtils = {
  // Easing functions
  easeInOutCubic: (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  
  // Animate number counters
  animateCounter: (element, start, end, duration = 2000) => {
    const startTime = performance.now();
    const difference = end - start;
    
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = AnimationUtils.easeInOutCubic(progress);
      const currentValue = start + (difference * easedProgress);
      
      element.textContent = Math.round(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  },
  
  // Intersection Observer for scroll animations
  createScrollObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    return new IntersectionObserver(callback, observerOptions);
  }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  const portfolioNav = new PortfolioNavigation();
  
  // Make navigation globally available
  window.PortfolioNavigation = portfolioNav;
  
  // Initialize scroll animations for elements
  const scrollElements = document.querySelectorAll('[data-scroll-animation]');
  
  if (scrollElements.length > 0) {
    const scrollObserver = AnimationUtils.createScrollObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          scrollObserver.unobserve(entry.target);
        }
      });
    });
    
    scrollElements.forEach(element => {
      scrollObserver.observe(element);
    });
  }
  
  // Initialize counter animations
  const counterElements = document.querySelectorAll('[data-counter]');
  
  if (counterElements.length > 0) {
    const counterObserver = AnimationUtils.createScrollObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const endValue = parseInt(element.getAttribute('data-counter'));
          AnimationUtils.animateCounter(element, 0, endValue);
          counterObserver.unobserve(element);
        }
      });
    });
    
    counterElements.forEach(element => {
      counterObserver.observe(element);
    });
  }
  
  console.log('Portfolio Navigation initialized successfully! 🚀');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioNavigation, AnimationUtils };
}