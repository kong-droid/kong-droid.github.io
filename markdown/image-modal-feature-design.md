# 이미지 모달 확대 기능 설계 문서

## 개요
thermolab 프로젝트의 인프라 구조도 이미지에 클릭 시 확대하여 볼 수 있는 모달 기능을 추가합니다.

## 현재 상황 분석

### 대상 파일
- **위치**: `views/thermolab/smartpod.html`
- **라인**: 121-126번째 줄
- **현재 구현**: 단순 `<img>` 태그로 구현되어 있음

```html
<div class="infrastructure-section">
    <h3>인프라 구조도</h3>
    <div class="infrastructure-diagram">
        <img src="public/images/projects/tlksys/smartpod/infrastructure.png" alt="스마트팟 서버 구성도" loading="lazy">
    </div>
</div>
```

### 이미지 파일
- **경로**: `public/images/projects/tlksys/smartpod/infrastructure.png`
- **상태**: 존재 확인됨

## 기능 요구사항

### 1. 기본 기능
- 인프라 구조도 이미지 클릭 시 모달로 확대하여 표시
- 모달 외부 영역 클릭 또는 ESC 키로 모달 닫기
- 확대된 이미지에서 원본 크기로 표시

### 2. 사용자 경험
- 부드러운 애니메이션으로 모달 열기/닫기
- 로딩 상태 표시
- 접근성 고려 (키보드 네비게이션, 스크린 리더 지원)

### 3. 반응형 대응
- 모바일에서도 적절한 크기로 표시
- 다양한 화면 크기에서 최적화된 뷰

## 기술 구현 방안

### 1. HTML 구조 변경
```html
<div class="infrastructure-section">
    <h3>인프라 구조도</h3>
    <div class="infrastructure-diagram">
        <img src="public/images/projects/tlksys/smartpod/infrastructure.png"
             alt="스마트팟 서버 구성도"
             loading="lazy"
             class="infrastructure-image clickable-image"
             data-modal-target="infrastructure-modal">
        <p class="image-hint">클릭하여 크게 보기</p>
    </div>
</div>

<!-- 이미지 모달 -->
<div id="infrastructure-modal" class="image-modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close" aria-label="모달 닫기">&times;</button>
            <h4 id="modal-title">스마트팟 서버 구성도</h4>
            <div class="modal-image-container">
                <img src="public/images/projects/tlksys/smartpod/infrastructure.png"
                     alt="스마트팟 서버 구성도"
                     class="modal-image">
            </div>
        </div>
    </div>
</div>
```

### 2. CSS 스타일
```css
/* 클릭 가능한 이미지 스타일 */
.clickable-image {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-image:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.image-hint {
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
}

/* 이미지 모달 스타일 */
.image-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.image-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: modalFadeIn 0.3s ease;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    z-index: 1;
}

.modal-close:hover {
    color: #333;
}

.modal-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 4px;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* 반응형 */
@media (max-width: 768px) {
    .modal-content {
        padding: 15px;
        margin: 10px;
    }

    .modal-image {
        max-height: 60vh;
    }

    .modal-close {
        top: 5px;
        right: 10px;
        font-size: 1.5rem;
    }
}
```

### 3. JavaScript 기능
```javascript
// 이미지 모달 기능 (main.js에 추가)
function initializeImageModal() {
    const clickableImages = document.querySelectorAll('.clickable-image');
    const modals = document.querySelectorAll('.image-modal');

    clickableImages.forEach(image => {
        image.addEventListener('click', function() {
            const modalTarget = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalTarget);

            if (modal) {
                openModal(modal);
            }
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // 닫기 버튼 클릭
        closeBtn.addEventListener('click', () => closeModal(modal));

        // 오버레이 클릭 (이미지 외부 영역)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal(modal);
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    });
}

function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지

    // 접근성: 모달 내 첫 번째 포커스 가능한 요소에 포커스
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // 배경 스크롤 복원
}

// 컴포넌트 초기화 후 실행되도록 추가
function initializePortfolioAfterComponents() {
    // ... 기존 초기화 코드 ...
    initializeImageModal();
}
```

## 파일 수정 계획

### 1. HTML 파일 수정
- `views/thermolab/smartpod.html`: 인프라 구조도 섹션 수정 및 모달 HTML 추가

### 2. CSS 파일 수정
- `public/css/main.css`: 이미지 모달 스타일 추가

### 3. JavaScript 파일 수정
- `public/js/main.js`: 이미지 모달 기능 추가

## 확장 가능성

### 1. 다른 프로젝트 적용
- ezpmp 프로젝트나 다른 이미지들에도 동일한 기능 적용 가능
- 재사용 가능한 컴포넌트로 설계

### 2. 추가 기능
- 이미지 확대/축소 (줌 인/아웃)
- 드래그로 이미지 이동
- 풀스크린 모드

### 3. 성능 최적화
- 이미지 지연 로딩
- 이미지 압축 최적화

## 테스트 계획

### 1. 기능 테스트
- [ ] 이미지 클릭 시 모달 정상 열림
- [ ] 모달 닫기 기능 (닫기 버튼, 외부 클릭, ESC 키)
- [ ] 반응형 디자인 테스트

### 2. 접근성 테스트
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 호환성
- [ ] 포커스 관리

### 3. 브라우저 호환성
- [ ] Chrome, Firefox, Safari, Edge 테스트
- [ ] 모바일 브라우저 테스트

## 구현 우선순위

1. **1단계**: 기본 모달 기능 구현
2. **2단계**: 스타일링 및 애니메이션 추가
3. **3단계**: 접근성 및 반응형 최적화
4. **4단계**: 추가 기능 및 확장성 고려

## 참고사항

- 기존 프로젝트 이미지 슬라이더와 스타일 일관성 유지
- 모바일 환경에서의 터치 인터랙션 고려
- SEO 및 접근성 가이드라인 준수
- 기존 컴포넌트 로딩 시스템과의 호환성 확보