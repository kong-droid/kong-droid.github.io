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
    this.setupFloatingElements();
    this.setupParallaxEffects();
    this.calculateCareerDuration();
  }

  setupElements() {
    // Skill bars
    this.skillBars = document.querySelectorAll('.skill-bar');
    
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
    if (!item) return;

    const marker = item.querySelector('.timeline-marker');
    const content = item.querySelector('.timeline-content');

    // 카루셀에서는 현재 활성 아이템만 애니메이션
    if (!item.classList.contains('active')) return;

    if (marker) {
      setTimeout(() => {
        marker.style.transform = 'scale(1.1)';
        setTimeout(() => {
          marker.style.transform = 'scale(1)';
        }, 300);
      }, 200);
    }

    if (content) {
      setTimeout(() => {
        content.style.transform = 'translateY(-3px)';
        setTimeout(() => {
          content.style.transform = 'translateY(0)';
        }, 200);
      }, 400);
    }
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

  calculateCareerDuration() {
    // 개발 시작일: 2020년 10월 1일
    const startDate = new Date('2020-10-01');
    const currentDate = new Date();
    
    // 경력 계산
    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // 일수 확인하여 월 수 조정
    if (currentDate.getDate() < startDate.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }
    
    const durationText = years > 0 ? `${years}년 ${months}개월의 개발 여정` : `${months}개월의 개발 여정`;
    const totalCareerText = years > 0 ? `${years}년 ${months}개월` : `${months}개월`;
    
    // DOM 업데이트
    const careerDurationElement = document.getElementById('career-duration');
    const totalCareerElement = document.getElementById('total-career');
    
    if (careerDurationElement) {
      careerDurationElement.textContent = durationText;
    }
    
    if (totalCareerElement) {
      totalCareerElement.textContent = totalCareerText;
    }
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

// Project Modal HTML Path Mapping
const projectHtmlPaths = {
  'smartpod': 'views/thermolab/smartpod.html',
  'gccell': 'views/thermolab/smartpod-gccell.html',
  'o2meet': 'views/ezpmp/o2meet.html',
  'healingfesta': 'views/ezpmp/healingfesta-2021.html',
  'dikidiki': 'views/ezpmp/dikidiki.html'
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

  async openModal(projectId) {
    if (!projectHtmlPaths[projectId] || !this.modal) {
      console.error(`Project ID not found or modal not available: ${projectId}`);
      return;
    }

    this.lastFocusedElement = document.activeElement;
    this.currentProjectId = projectId; // 현재 모달 ID 저장
    
    // HTML 콘텐츠 로드
    const loadSuccess = await this.loadModalContentFromHtml(projectId);
    if (!loadSuccess) {
      console.error('Failed to load modal content');
      return;
    }
    
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

  async loadModalContentFromHtml(projectId) {
    const htmlPath = projectHtmlPaths[projectId];
    if (!htmlPath) {
      console.error(`No HTML path found for project: ${projectId}`);
      return false;
    }

    try {
      const response = await fetch(htmlPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${htmlPath}: ${response.statusText}`);
      }
      
      const htmlContent = await response.text();
      
      // 모달 콘텐츠에 HTML 삽입
      if (this.modalContent) {
        this.modalContent.innerHTML = htmlContent;
      }
      
      // HTML 콘텐츠에서 제목과 기간 추출하여 모달 헤더에 설정
      this.extractAndSetModalHeader();
      
      return true;
    } catch (error) {
      console.error('Error loading modal content:', error);
      return false;
    }
  }
  
  extractAndSetModalHeader() {
    if (!this.modalContent) return;
    
    // HTML 콘텐츠에서 기간 추출
    const periodElement = this.modalContent.querySelector('.project-period');
    if (periodElement && this.modalPeriod) {
      this.modalPeriod.textContent = periodElement.textContent;
    }
    
    // 프로젝트 ID에 따른 제목 설정
    const projectTitles = {
      'smartpod': '스마트팟 (SmartPod)',
      'gccell': 'GC CELL 중계 서버',
      'o2meet': '오투미트 (O2MEET)',
      'healingfesta': '힐링페스타 경주 2021',
      'dikidiki': '디키디키 (DDP 어린이 놀이터)'
    };
    
    // 현재 열린 모달의 프로젝트 ID 찾기
    const activeProjectCard = document.querySelector('.project-card[data-project-id]');
    if (activeProjectCard) {
      const currentProjectId = this.currentProjectId; // 현재 열린 모달의 ID 저장
      if (currentProjectId && projectTitles[currentProjectId] && this.modalTitle) {
        this.modalTitle.textContent = projectTitles[currentProjectId];
      }
    }
    
    // 이미지 슬라이더 초기화
    this.initializeImageSlider();
  }
  
  initializeImageSlider() {
    const sliders = this.modalContent?.querySelectorAll('.project-image-slider');
    if (!sliders || sliders.length === 0) return;
    
    sliders.forEach(slider => {
      this.setupSlider(slider);
    });
  }
  
  setupSlider(sliderElement) {
    const slides = sliderElement.querySelectorAll('.slide');
    const dots = sliderElement.querySelectorAll('.dot');
    const prevBtn = sliderElement.querySelector('.prev-btn');
    const nextBtn = sliderElement.querySelector('.next-btn');
    const progressBar = sliderElement.querySelector('.progress-bar');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let isTransitioning = false;
    
    // 이미지 프리로딩
    this.preloadImages(slides);
    
    const showSlide = (index) => {
      if (isTransitioning || index < 0 || index >= slides.length) return;
      
      isTransitioning = true;
      
      try {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
        
        // 진행률 업데이트
        if (progressBar) {
          const progress = ((index + 1) / slides.length) * 100;
          progressBar.style.width = `${progress}%`;
        }
        
        // 다음/이전 이미지 프리로드
        this.preloadAdjacentImages(slides, index);
        
      } catch (error) {
        console.warn('Slide transition error:', error);
      } finally {
        // 전환 완료 후 플래그 리셋 (CSS 전환 시간과 동일)
        setTimeout(() => {
          isTransitioning = false;
        }, 500);
      }
    };
    
    const nextSlide = () => {
      if (isTransitioning) return;
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };
    
    const prevSlide = () => {
      if (isTransitioning) return;
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };
    
    const goToSlide = (index) => {
      if (isTransitioning || index === currentSlide) return;
      currentSlide = index;
      showSlide(currentSlide);
    };
    
    // 이벤트 리스너 추가
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
    
    // 키보드 내비게이션
    sliderElement.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        e.preventDefault();
      }
    });
    
    // 터치/스와이프 지원
    this.setupTouchEvents(sliderElement, { nextSlide, prevSlide });
    
    // 이미지 클릭 시 라이트박스 열기
    this.setupLightboxEvents(sliderElement, slides);
    
    // 자동 슬라이드 (선택사항)
    let autoSlideInterval;
    
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };
    
    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };
    
    // 마우스 호버 시 자동 슬라이드 일시정지
    sliderElement.addEventListener('mouseenter', stopAutoSlide);
    sliderElement.addEventListener('mouseleave', startAutoSlide);
    
    // 초기 자동 슬라이드 시작
    startAutoSlide();
    
    // 초기 진행률 설정
    if (progressBar) {
      const progress = ((currentSlide + 1) / slides.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    // 모달이 닫힐 때 자동 슬라이드 정지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const modal = mutation.target.closest('.project-modal');
          if (modal && modal.classList.contains('hidden')) {
            stopAutoSlide();
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  }
  
  setupTouchEvents(element, { nextSlide, prevSlide }) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let startTime = 0;
    
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    // 터치 시작
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isDragging = true;
      
      // 자동 슬라이드 일시정지
      element.dispatchEvent(new Event('mouseenter'));
    };
    
    // 터치 이동
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // 세로 스크롤 방지 (수평 스와이프가 더 클 때)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    };
    
    // 터치 종료
    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = Date.now() - startTime;
      
      isDragging = false;
      
      // 스와이프 조건 확인
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const isQuickSwipe = deltaTime < maxSwipeTime;
      const isLongEnoughSwipe = Math.abs(deltaX) > minSwipeDistance;
      
      if (isHorizontalSwipe && isQuickSwipe && isLongEnoughSwipe) {
        if (deltaX > 0) {
          // 오른쪽으로 스와이프 = 이전 슬라이드
          prevSlide();
        } else {
          // 왼쪽으로 스와이프 = 다음 슬라이드
          nextSlide();
        }
      }
      
      // 자동 슬라이드 재시작
      element.dispatchEvent(new Event('mouseleave'));
    };
    
    // 이벤트 리스너 등록
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  setupLightboxEvents(sliderElement, slides) {
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openLightbox(slides, index);
        });
      }
    });
  }
  
  openLightbox(slides, currentIndex = 0) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxThumbnails = lightbox.querySelector('.lightbox-thumbnails');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    
    if (!lightbox) return;
    
    let currentLightboxIndex = currentIndex;
    
    // 썸네일 생성
    lightboxThumbnails.innerHTML = '';
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img) {
        const thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.alt = img.alt;
        thumbnail.className = `lightbox-thumbnail ${index === currentIndex ? 'active' : ''}`;
        thumbnail.addEventListener('click', () => showLightboxSlide(index));
        lightboxThumbnails.appendChild(thumbnail);
      }
    });
    
    const showLightboxSlide = (index) => {
      const slide = slides[index];
      const img = slide.querySelector('img');
      const caption = slide.querySelector('.slide-caption');
      
      if (img) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : img.alt;
        
        // 썸네일 활성화 업데이트
        lightboxThumbnails.querySelectorAll('.lightbox-thumbnail').forEach((thumb, i) => {
          thumb.classList.toggle('active', i === index);
        });
        
        currentLightboxIndex = index;
      }
    };
    
    const nextLightboxSlide = () => {
      const nextIndex = (currentLightboxIndex + 1) % slides.length;
      showLightboxSlide(nextIndex);
    };
    
    const prevLightboxSlide = () => {
      const prevIndex = (currentLightboxIndex - 1 + slides.length) % slides.length;
      showLightboxSlide(prevIndex);
    };
    
    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
      
      // 이벤트 리스너 제거
      lightboxClose.removeEventListener('click', closeLightbox);
      lightboxPrev.removeEventListener('click', prevLightboxSlide);
      lightboxNext.removeEventListener('click', nextLightboxSlide);
      lightboxOverlay.removeEventListener('click', closeLightbox);
      document.removeEventListener('keydown', handleLightboxKeydown);
    };
    
    const handleLightboxKeydown = (e) => {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextLightboxSlide();
          break;
        case 'ArrowLeft':
          prevLightboxSlide();
          break;
      }
    };
    
    // 이벤트 리스너 등록
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevLightboxSlide);
    lightboxNext.addEventListener('click', nextLightboxSlide);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', handleLightboxKeydown);
    
    // 터치 이벤트도 추가
    this.setupTouchEvents(lightbox, { 
      nextSlide: nextLightboxSlide, 
      prevSlide: prevLightboxSlide 
    });
    
    // 초기 슬라이드 표시
    showLightboxSlide(currentIndex);
    
    // 라이트박스 열기
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  // 이미지 프리로딩 메서드들
  preloadImages(slides) {
    // 첫 번째와 두 번째 이미지만 즉시 로드
    const prioritySlides = Array.from(slides).slice(0, 2);
    
    prioritySlides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img && !img.complete) {
        this.loadImageWithFallback(img);
      }
    });
    
    // 나머지 이미지는 지연 로드
    if (slides.length > 2) {
      setTimeout(() => {
        const remainingSlides = Array.from(slides).slice(2);
        remainingSlides.forEach(slide => {
          const img = slide.querySelector('img');
          if (img && !img.complete) {
            this.loadImageWithFallback(img);
          }
        });
      }, 1000);
    }
  }
  
  preloadAdjacentImages(slides, currentIndex) {
    const nextIndex = (currentIndex + 1) % slides.length;
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    
    [nextIndex, prevIndex].forEach(index => {
      const img = slides[index]?.querySelector('img');
      if (img && !img.complete) {
        this.loadImageWithFallback(img);
      }
    });
  }
  
  loadImageWithFallback(img) {
    return new Promise((resolve, reject) => {
      // 이미 로드된 이미지인 경우
      if (img.complete && img.naturalHeight !== 0) {
        resolve(img);
        return;
      }
      
      const onLoad = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        img.classList.remove('loading');
        resolve(img);
      };
      
      const onError = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        img.classList.remove('loading');
        
        // 폴백 이미지 또는 placeholder 설정
        this.setFallbackImage(img);
        reject(new Error(`Failed to load image: ${img.src}`));
      };
      
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);
      img.classList.add('loading');
      
      // 이미지 로드 시작
      if (!img.src) {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.src = dataSrc;
        }
      }
    });
  }
  
  setFallbackImage(img) {
    // 이미지 로드 실패 시 플레이스홀더 설정
    const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngCDroZzrk5zsnpHsl4DrsLHsirXri4jri6Q8L3RleHQ+PC9zdmc+';
    
    img.src = fallbackSrc;
    img.alt = img.alt || '이미지 로드 실패';
    img.style.filter = 'grayscale(100%)';
    
    console.warn(`Image load failed: ${img.getAttribute('data-original-src') || img.src}`);
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