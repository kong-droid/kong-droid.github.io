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
      threshold: 0.1
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

// Project Modal Data
const projectData = {
  'smartpod': {
    title: '스마트팟 (SmartPod)',
    period: '2023.04 ~ 진행중',
    description: '실시간으로 데이터 로거의 온도를 집계하고 레포트를 보여주는 관제 시스템',
    features: [
      '실시간 온도 데이터 수집 및 모니터링',
      '데이터 시각화 및 리포팅 시스템',
      '알림 및 경고 시스템',
      '사용자 관리 및 권한 제어'
    ],
    techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Docker'],
    achievements: ['RDS 비용 50% 절감', '조회속도 3초→0.5초 개선']
  },
  'gccell': {
    title: 'GC CELL 중계 서버',
    period: '2024.12 ~ 2025.03',
    description: '실시간으로 데이터 로거의 온도를 집계해 GC CELL 서버에 온도 데이터를 전송하는 서버',
    features: [
      '다수의 데이터 로거로부터 실시간 온도 수집',
      'GC CELL 서버와의 안정적인 통신',
      '데이터 무결성 및 전송 오류 처리',
      '시스템 모니터링 및 로그 관리'
    ],
    techStack: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'AWS', 'REST API'],
    achievements: []
  },
  'o2meet': {
    title: '오투미트 (O2MEET)',
    period: '2021.01 ~ 2023.02',
    description: '모두가 행사를 편하게 만들고 개최하는 시스템',
    features: [
      '행사 생성 및 관리 플랫폼',
      '참가자 등록 및 관리',
      '결제 시스템 연동',
      '행사 홍보 및 마케팅 도구',
      '실시간 알림 및 소통 기능'
    ],
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf', 'JavaScript'],
    achievements: []
  },
  'healingfesta': {
    title: '힐링페스타 경주 2021',
    period: '2021.05 ~ 2021.11',
    description: '다양한 힐링 프로그램을 소개하고, 간편 오프라인 결제로 온라인 강의를 들을 수 있는 시스템',
    features: [
      '힐링 프로그램 소개 및 카탈로그',
      '온라인 강의 플랫폼',
      '오프라인 결제 시스템 연동',
      '사용자 학습 진도 관리',
      '강사-수강생 소통 기능'
    ],
    techStack: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'Payment API'],
    achievements: []
  },
  'dikidiki': {
    title: '디키디키 (DDP 디키디키점)',
    period: '2020.10 ~ 2021.12',
    description: 'DDP 디키디키점 예약 및 소개 시스템',
    features: [
      '매장 소개 및 메뉴 관리',
      '테이블 예약 시스템',
      '실시간 예약 현황 관리',
      '고객 관리 및 알림 서비스',
      '매출 및 통계 관리'
    ],
    techStack: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'jQuery'],
    achievements: []
  }
};

// Project Modal Manager
class ProjectModal {
  constructor() {
    this.modal = null;
    this.modalContainer = null;
    this.modalTitle = null;
    this.modalPeriod = null;
    this.modalContent = null;
    this.modalClose = null;
    this.isOpen = false;
    this.lastFocusedElement = null;
    
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
  }

  bindElements() {
    this.modal = document.getElementById('projectModal');
    this.modalContainer = this.modal?.querySelector('.modal-container');
    this.modalTitle = this.modal?.querySelector('.modal-title');
    this.modalPeriod = this.modal?.querySelector('.modal-period');
    this.modalContent = this.modal?.querySelector('.modal-content');
    this.modalClose = this.modal?.querySelector('.modal-close');
  }

  bindEvents() {
    if (!this.modal) return;

    // 카드 클릭 이벤트
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('[data-project-id]');
      if (projectCard) {
        e.preventDefault();
        const projectId = projectCard.dataset.projectId;
        this.openModal(projectId);
      }
    });

    // 모달 닫기 이벤트들
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      // 모달 배경 클릭 시 닫기 (모달 컨테이너 클릭은 제외)
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });

    // 모달 컨테이너 클릭 시 이벤트 전파 방지
    this.modalContainer?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !this.modal) return;

    this.lastFocusedElement = document.activeElement;
    
    // 모달 콘텐츠 생성
    this.populateModalContent(data);
    
    // 모달 표시
    this.modal.classList.remove('hidden');
    this.modal.classList.add('show');
    
    // 스크롤 잠금
    document.body.style.overflow = 'hidden';
    
    // 포커스 관리
    setTimeout(() => {
      this.modalClose?.focus();
    }, 300);
    
    this.isOpen = true;
  }

  closeModal() {
    if (!this.modal) return;
    
    // 모달 숨기기
    this.modal.classList.remove('show');
    this.modal.classList.add('hidden');
    
    // 스크롤 복원
    document.body.style.overflow = '';
    
    // 포커스 복원
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
    
    this.isOpen = false;
  }

  populateModalContent(data) {
    // 제목과 기간 설정
    if (this.modalTitle) this.modalTitle.textContent = data.title;
    if (this.modalPeriod) this.modalPeriod.textContent = data.period;

    // 콘텐츠 생성
    if (this.modalContent) {
      this.modalContent.innerHTML = `
        <h3>프로젝트 개요</h3>
        <p>${data.description}</p>
        
        <h3>주요 기능</h3>
        <ul class="modal-features">
          ${data.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        
        <h3>기술 스택</h3>
        <div class="modal-tech-stack">
          ${data.techStack.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
        </div>
        
        ${data.achievements.length > 0 ? `
          <div class="modal-achievements">
            <h4>주요 성과</h4>
            <ul>
              ${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      `;
    }
  }
}

// 클래스를 전역에서 사용할 수 있도록 등록
window.PortfolioMain = PortfolioMain;
window.PortfolioAnimations = PortfolioAnimations;
window.ProjectModal = ProjectModal;

// 자동 초기화는 component-loader.js에서 담당
// Initialize main functionality when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   // Initialize main portfolio functionality
//   const portfolioMain = new PortfolioMain();
//   
//   // Make main functionality globally available
//   window.PortfolioMain = portfolioMain;
//   window.PortfolioAnimations = PortfolioAnimations;
  
  // CSS는 component-loader.js에서 추가
  // const style = document.createElement('style');
  // 나머지 코드는 주석 처리
// });

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioMain, PortfolioAnimations };
}