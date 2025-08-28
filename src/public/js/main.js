/**
 * Portfolio - Main JavaScript
 * Handles page interactions, animations, and dynamic content
 */

class PortfolioMain {
  constructor() {
    this.init();
  }

  init() {
    this.setupElements();
    this.initializeAnimations();
    this.setupSkillBars();
    this.setupContactForm();
    this.setupFloatingElements();
    this.setupParallaxEffects();
  }

  setupElements() {
    // Skill bars
    this.skillBars = document.querySelectorAll('.skill-bar');
    
    // Contact form
    this.contactForm = document.querySelector('.contact-form');
    
    // Floating elements
    this.floatingElements = document.querySelectorAll('.floating-item');
    
    // Hero elements
    this.heroTitle = document.querySelector('.hero-title');
    this.heroStats = document.querySelectorAll('.stat-number');
    
    // Scroll indicator
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Project cards
    this.projectCards = document.querySelectorAll('.project-card');
  }

  initializeAnimations() {
    // Setup scroll reveal animations
    this.setupScrollReveal();
    
    // Setup typing animation for hero title
    this.setupTypingAnimation();
    
    // Setup scroll indicator animation
    this.setupScrollIndicator();
    
    // Setup project cards hover effects
    this.setupProjectCardEffects();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll(`
      .hero-content,
      .section-header,
      .about-content,
      .about-info,
      .skill-category,
      .timeline-item,
      .project-card,
      .contact-info,
      .contact-form-container
    `);

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Special handling for timeline items
          if (entry.target.classList.contains('timeline-item')) {
            this.animateTimelineItem(entry.target);
          }
          
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      element.classList.add('reveal-element');
      revealObserver.observe(element);
    });
  }

  setupTypingAnimation() {
    if (!this.heroTitle) return;

    const titleLines = this.heroTitle.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('typing-animation');
      }, index * 800);
    });
  }

  setupScrollIndicator() {
    if (!this.scrollIndicator) return;

    // Animate scroll indicator
    setInterval(() => {
      this.scrollIndicator.classList.toggle('bounce');
    }, 2000);

    // Hide scroll indicator when not on home section
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > window.innerHeight * 0.5) {
        this.scrollIndicator.style.opacity = '0';
      } else {
        this.scrollIndicator.style.opacity = '1';
      }
    });
  }

  setupSkillBars() {
    const skillSection = document.querySelector('.skills-section');
    if (!skillSection) return;

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillBars();
          skillObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    });

    skillObserver.observe(skillSection);
  }

  animateSkillBars() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
        bar.classList.add('animated');
      }, index * 100);
    });
  }

  animateTimelineItem(item) {
    const marker = item.querySelector('.timeline-marker');
    const content = item.querySelector('.timeline-content');
    
    setTimeout(() => {
      marker.classList.add('pulse');
    }, 200);
    
    setTimeout(() => {
      content.classList.add('slide-in');
    }, 400);
  }

  setupContactForm() {
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmit();
    });

    // Real-time form validation
    const inputs = this.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  handleContactFormSubmit() {
    const formData = new FormData(this.contactForm);
    const submitButton = this.contactForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      this.showSuccessMessage();
      submitButton.classList.remove('loading');
      submitButton.innerHTML = '<i class="fas fa-check"></i> 전송 완료!';
      
      // Reset form after delay
      setTimeout(() => {
        this.contactForm.reset();
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> 메시지 보내기';
      }, 2000);
    }, 2000);
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    this.clearFieldError(field);

    // Validation rules
    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          errorMessage = '이름을 입력해주세요.';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = '이름은 2글자 이상 입력해주세요.';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errorMessage = '이메일을 입력해주세요.';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = '올바른 이메일 형식을 입력해주세요.';
        }
        break;
        
      case 'subject':
        if (!value) {
          isValid = false;
          errorMessage = '제목을 입력해주세요.';
        }
        break;
        
      case 'message':
        if (!value) {
          isValid = false;
          errorMessage = '메시지를 입력해주세요.';
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = '메시지는 10글자 이상 입력해주세요.';
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>메시지가 성공적으로 전송되었습니다!</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  setupFloatingElements() {
    if (this.floatingElements.length === 0) return;

    this.floatingElements.forEach((element, index) => {
      // Initial random position
      const initialDelay = index * 200;
      const floatDuration = 3000 + (index * 500);
      
      setTimeout(() => {
        element.classList.add('floating');
        this.animateFloatingElement(element, floatDuration);
      }, initialDelay);
    });
  }

  animateFloatingElement(element, duration) {
    const animate = () => {
      const randomX = (Math.random() - 0.5) * 20;
      const randomY = (Math.random() - 0.5) * 20;
      
      element.style.transform = `translate(${randomX}px, ${randomY}px)`;
      
      setTimeout(animate, duration);
    };
    
    animate();
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, { passive: true });
  }

  setupProjectCardEffects() {
    this.projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateProjectCard(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateProjectCard(card, false);
      });
    });
  }

  animateProjectCard(card, isHover) {
    const image = card.querySelector('.project-image img');
    const overlay = card.querySelector('.project-overlay');
    const content = card.querySelector('.project-content');
    
    if (isHover) {
      image.style.transform = 'scale(1.1)';
      overlay.style.opacity = '1';
      content.style.transform = 'translateY(-5px)';
    } else {
      image.style.transform = 'scale(1)';
      overlay.style.opacity = '0';
      content.style.transform = 'translateY(0)';
    }
  }

  // Public method to trigger animations
  triggerAnimation(elementSelector, animationType = 'fadeInUp') {
    const elements = document.querySelectorAll(elementSelector);
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animated', animationType);
      }, index * 100);
    });
  }

  // Public method to show loading state
  showLoading(element) {
    element.classList.add('loading');
    element.setAttribute('disabled', 'disabled');
  }

  hideLoading(element) {
    element.classList.remove('loading');
    element.removeAttribute('disabled');
  }
}

// Utility functions for common animations
const PortfolioAnimations = {
  // Smooth reveal animation
  fadeInUp: (element, delay = 0) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 50);
    }, delay);
  },

  // Scale animation
  scaleIn: (element, delay = 0) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8)';
      element.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, 50);
    }, delay);
  },

  // Slide in from left
  slideInLeft: (element, delay = 0) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateX(-50px)';
      element.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      }, 50);
    }, delay);
  },

  // Create particle effect
  createParticles: (container, count = 20) => {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(particle);
    }
  }
};

// Initialize main functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main portfolio functionality
  const portfolioMain = new PortfolioMain();
  
  // Make main functionality globally available
  window.PortfolioMain = portfolioMain;
  window.PortfolioAnimations = PortfolioAnimations;
  
  // Add custom CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .reveal-element {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }
    
    .reveal-element.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    .typing-animation {
      overflow: hidden;
      border-right: 3px solid var(--color-secondary);
      white-space: nowrap;
      animation: typing 1.5s steps(20) forwards, blink-caret 0.75s step-end infinite;
    }
    
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: var(--color-secondary); }
    }
    
    .skill-bar {
      width: 0%;
      height: 8px;
      background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
      border-radius: 4px;
      transition: width 1.5s ease-in-out;
      position: relative;
    }
    
    .skill-bar.animated::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      background: white;
      border-radius: 2px;
      box-shadow: 0 0 10px var(--color-secondary);
      animation: glow 0.5s ease-in-out;
    }
    
    @keyframes glow {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    .floating {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .bounce {
      animation: bounce 1s ease-in-out;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    }
    
    .notification.success {
      border-left: 4px solid var(--color-secondary);
      color: var(--color-secondary);
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .field-error {
      display: block;
      color: var(--color-accent);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-xs);
    }
    
    .form-group input.error,
    .form-group textarea.error {
      border-color: var(--color-accent);
    }
    
    .btn.loading {
      pointer-events: none;
      opacity: 0.7;
    }
    
    .timeline-marker.pulse {
      animation: pulse 2s infinite;
    }
    
    .timeline-content.slide-in {
      animation: slideIn 0.6s ease forwards;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
      100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  
  document.head.appendChild(style);
  
  console.log('Portfolio Main functionality initialized successfully! ✨');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioMain, PortfolioAnimations };
}