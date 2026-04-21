/**
 * Component Loader
 * HTML 컴포넌트들을 동적으로 로드하는 시스템
 */

class ComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * 컴포넌트를 로드하고 지정된 요소에 삽입
   * @param {string} componentPath - 컴포넌트 파일 경로
   * @param {string} targetSelector - 삽입할 대상 요소의 선택자
   * @param {boolean} cache - 캐시 사용 여부 (기본값: true)
   */
  async loadComponent(componentPath, targetSelector, cache = true) {
    try {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }

      // 캐시된 로딩 프로미스가 있으면 재사용
      if (cache && this.loadingPromises.has(componentPath)) {
        const cachedHtml = await this.loadingPromises.get(componentPath);
        targetElement.innerHTML = cachedHtml;
        return;
      }

      // 새로운 로딩 프로미스 생성
      const loadingPromise = this.fetchComponent(componentPath);
      
      if (cache) {
        this.loadingPromises.set(componentPath, loadingPromise);
      }

      const html = await loadingPromise;
      targetElement.innerHTML = html;
      
      // 로드 완료 표시
      this.loadedComponents.add(componentPath);
      
      // 커스텀 이벤트 발생
      this.dispatchLoadEvent(componentPath, targetSelector);
      
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      this.handleLoadError(targetSelector, error);
    }
  }

  /**
   * 컴포넌트 파일을 fetch로 가져오기
   * @param {string} componentPath - 컴포넌트 파일 경로
   * @returns {Promise<string>} HTML 문자열
   */
  async fetchComponent(componentPath) {
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  }

  /**
   * 여러 컴포넌트를 병렬로 로드
   * @param {Array<{path: string, target: string}>} components - 컴포넌트 배열
   */
  async loadMultipleComponents(components) {
    const loadPromises = components.map(({path, target}) => 
      this.loadComponent(path, target)
    );

    try {
      await Promise.all(loadPromises);
      console.log('All components loaded successfully');
    } catch (error) {
      console.error('Some components failed to load:', error);
    }
  }

  /**
   * 로드 완료 이벤트 발생
   * @param {string} componentPath - 컴포넌트 경로
   * @param {string} targetSelector - 대상 선택자
   */
  dispatchLoadEvent(componentPath, targetSelector) {
    const event = new CustomEvent('componentLoaded', {
      detail: {
        componentPath,
        targetSelector,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 로드 에러 처리
   * @param {string} targetSelector - 대상 선택자
   * @param {Error} error - 에러 객체
   */
  handleLoadError(targetSelector, error) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      targetElement.innerHTML = `
        <div class="component-error">
          <p>컴포넌트 로드 실패</p>
          <small>${error.message}</small>
        </div>
      `;
    }
  }

  /**
   * 로딩 상태 표시
   * @param {string} targetSelector - 대상 선택자
   */
  showLoading(targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      targetElement.innerHTML = `
        <div class="component-loading">
          <div class="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      `;
    }
  }

  /**
   * 캐시 클리어
   */
  clearCache() {
    this.loadedComponents.clear();
    this.loadingPromises.clear();
  }

  /**
   * 컴포넌트 로드 상태 확인
   * @param {string} componentPath - 컴포넌트 경로
   * @returns {boolean} 로드 여부
   */
  isLoaded(componentPath) {
    return this.loadedComponents.has(componentPath);
  }
}

// 전역 ComponentLoader 인스턴스 생성
window.componentLoader = new ComponentLoader();

// DOM이 로드된 후 메인 컴포넌트들 자동 로드
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Starting component loading...');
  
  // 메인 컴포넌트들 정의
  const mainComponents = [
    { path: 'views/cement/header.html', target: '#header-placeholder' },
    { path: 'views/cement/hero.html', target: '#hero-placeholder' },
    { path: 'views/cement/about.html', target: '#about-placeholder' },
    { path: 'views/cement/skills.html', target: '#skills-placeholder' },
    { path: 'views/cement/experience.html', target: '#experience-placeholder' },
    { path: 'views/cement/projects.html', target: '#projects-placeholder' },
    { path: 'views/cement/footer.html', target: '#footer-placeholder' }
  ];

  // 순차적으로 로드 (헤더 먼저, 나머지는 병렬)
  try {
    // 헤더 먼저 로드
    await window.componentLoader.loadComponent(
      mainComponents[0].path, 
      mainComponents[0].target
    );
    
    // 나머지 컴포넌트들 병렬 로드
    await window.componentLoader.loadMultipleComponents(
      mainComponents.slice(1)
    );
    
    console.log('All main components loaded successfully');
    
    // 모든 컴포넌트 로드 완료 이벤트 발생
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
    
    // JavaScript 초기화 트리거
    initializePortfolioAfterComponents();
    
  } catch (error) {
    console.error('Failed to load main components:', error);
  }
});

// 컴포넌트 로드 완료 후 포트폴리오 초기화
function initializePortfolioAfterComponents() {
  // 약간의 지연을 주어 DOM이 완전히 렌더링되도록 함
  setTimeout(async () => {
    console.log('Initializing portfolio functionality...');

    // i18n 초기화 (최우선)
    if (window.i18n) {
      await window.i18n.init();
    }

    // CSS 스타일 추가
    addPortfolioStyles();

    // Navigation 재초기화
    if (typeof PortfolioNavigation !== 'undefined') {
      window.portfolioNav = new PortfolioNavigation();
      
      // 푸터 링크 확인을 위한 디버그 로그
      const footerLinks = document.querySelectorAll('.footer-links a');
      console.log('Footer links found:', footerLinks.length);
    }
    
    // Main 기능 재초기화  
    if (typeof PortfolioMain !== 'undefined') {
      window.portfolioMain = new PortfolioMain();
    }
    
    // 스크롤 애니메이션 초기화
    initializeScrollAnimations();
    
    // 카운터 애니메이션 초기화
    initializeCounterAnimations();


    console.log('Portfolio functionality initialized after component loading! 🎉');
  }, 100);
}

// 포트폴리오 스타일 추가
function addPortfolioStyles() {
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
    
    /* 모바일 전용 터치 최적화 - PC에 영향 없음 */
    @media (max-width: 1024px) {
      /* 터치 디바이스 기본 최적화 */
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* 입력 요소 터치 최적화 */
      input, textarea, button, select {
        touch-action: manipulation;
        -webkit-appearance: none;
        min-height: 44px;
      }
      
      /* 버튼 터치 영역 확보 */
      .btn {
        min-height: 48px;
        padding: 12px 24px;
      }
      
      /* 링크 터치 영역 확보 */
      a {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
      }
    }
    
    /* 터치 디바이스에서만 적용되는 스타일 */
    @media (hover: none) and (pointer: coarse) {
      /* 버튼 터치 피드백 */
      .btn:active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
      }
      
      /* 입력 필드 포커스 개선 */
      input:focus, textarea:focus {
        border-color: var(--color-secondary) !important;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
      
      /* 카드 터치 피드백 */
      .project-card:active,
      .skill-category:active,
      .timeline-item:active {
        transform: scale(0.99);
        transition: transform 0.1s ease;
      }
    }
    
    /* iOS Safari 최적화 */
    @media (max-width: 1024px) {
      /* iOS 줌 방지 */
      input[type="text"],
      input[type="email"],
      input[type="tel"],
      textarea {
        font-size: 16px;
      }
      
      /* iOS 터치 콜아웃 제거 */
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* 텍스트는 선택 가능하도록 */
      p, span, div, h1, h2, h3, h4, h5, h6 {
        -webkit-user-select: text;
        user-select: text;
      }
      
      /* 입력 요소는 선택 가능하도록 */
      input, textarea {
        -webkit-user-select: auto;
        user-select: auto;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// 스크롤 애니메이션 초기화
function initializeScrollAnimations() {
  const scrollElements = document.querySelectorAll('[data-scroll-animation]');
  
  if (scrollElements.length > 0 && typeof AnimationUtils !== 'undefined') {
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
}

// 카운터 애니메이션 초기화
function initializeCounterAnimations() {
  const counterElements = document.querySelectorAll('[data-counter]');
  
  if (counterElements.length > 0 && typeof AnimationUtils !== 'undefined') {
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
}

// 컴포넌트 로드 완료 시 이벤트 리스너 예제
document.addEventListener('componentLoaded', (event) => {
  console.log('Component loaded:', event.detail);
});

document.addEventListener('allComponentsLoaded', () => {
  console.log('All components are ready!');
  // 여기에 모든 컴포넌트 로드 후 실행할 초기화 코드 작성

  // 프로젝트 모달 초기화
  if (typeof ProjectModal !== 'undefined') {
    window.projectModal = new ProjectModal();
    console.log('Project modal initialized');
  }
});

