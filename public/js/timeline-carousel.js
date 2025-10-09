class TimelineCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.isAnimating = false;

    this.initializeElements();
    this.bindEvents();
    this.updateCarousel();
  }

  initializeElements() {
    this.wrapper = document.querySelector('.timeline-wrapper');
    this.items = document.querySelectorAll('.timeline-item');
    this.dots = document.querySelectorAll('.timeline-dot');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');

    if (!this.wrapper) {
      console.warn('Timeline carousel elements not found');
      return;
    }
  }

  bindEvents() {
    if (!this.wrapper) return;

    // 네비게이션 버튼 이벤트
    this.prevBtn?.addEventListener('click', () => this.previousSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // 도트 인디케이터 기능 제거됨

    // 터치/스와이프 이벤트
    this.addTouchEvents();

    // 키보드 이벤트
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // 자동 슬라이드 기능 제거됨
  }

  addTouchEvents() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    this.wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.wrapper.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = startX - endX;
      const deltaY = startY - endY;

      // 가로 스와이프가 세로 스와이프보다 클 때만 처리
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }, { passive: true });
  }

  // 자동 슬라이드 기능 제거됨

  previousSlide() {
    if (this.isAnimating) return;

    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  nextSlide() {
    if (this.isAnimating) return;

    this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide) return;

    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    if (!this.wrapper) return;

    this.isAnimating = true;

    // 슬라이드 이동
    const translateX = -this.currentSlide * 33.333;
    this.wrapper.style.transform = `translateX(${translateX}%)`;

    // 활성 아이템 업데이트
    this.items.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentSlide);
    });

    // 도트 인디케이터 기능 제거됨

    // 네비게이션 버튼 상태 업데이트
    if (this.prevBtn) {
      this.prevBtn.disabled = false; // 무한 루프이므로 항상 활성화
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = false; // 무한 루프이므로 항상 활성화
    }

    // 애니메이션 완료 후 플래그 리셋
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  destroy() {
    clearInterval(this.autoSlideInterval);
  }
}

// 컴포넌트 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 타임라인 섹션이 로드되기를 기다림
  const initCarousel = () => {
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    if (timelineWrapper) {
      window.timelineCarousel = new TimelineCarousel();
    } else {
      // 컴포넌트 로딩을 위해 잠시 후 재시도
      setTimeout(initCarousel, 100);
    }
  };

  initCarousel();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (window.timelineCarousel) {
    window.timelineCarousel.destroy();
  }
});