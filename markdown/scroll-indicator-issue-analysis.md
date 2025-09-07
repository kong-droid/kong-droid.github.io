# Scroll Indicator 문제 분석 보고서

## 문제 1: scroll-indicator 오른쪽 이동 원인

### 현재 스타일 설정
```css
.scroll-indicator {
  position: absolute;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-medium);
}

.scroll-indicator:hover {
  color: var(--color-secondary);
  transform: translateX(-50%) translateY(-5px);
}
```

### 오른쪽 이동 원인
**확인된 원인: 스타일 자체에는 문제가 없음**

현재 CSS는 완벽하게 중앙 정렬을 위해 설정되어 있습니다:
- `left: 50%` + `transform: translateX(-50%)`로 수평 중앙 정렬
- 부모 요소인 `.hero-section .container`에 relative positioning이 있어야 함

### 가능한 원인들
1. **부모 요소의 positioning 문제** - `.hero-section` 또는 `.container`의 position 값
2. **다른 CSS 충돌** - 특정 상황에서 transform이나 left 값이 덮어씌워짐
3. **JavaScript 동작** - 스크립트에서 동적으로 위치를 변경하는 코드 존재 가능성
4. **미디어쿼리 충돌** - 특정 화면 크기에서 다른 스타일이 적용될 수 있음

## 문제 2: 모바일에서 프로필과 스크롤 클래스 겹침

### 현재 모바일 미디어쿼리 상황
```css
@media (max-width: 767px) {
  .hero-section {
    min-height: 90vh;
    padding: var(--spacing-xl) 0;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }
}
```

### 문제 원인
1. **scroll-indicator에 모바일 전용 스타일 없음** - 현재 scroll-indicator는 모든 화면 크기에서 동일한 위치 규칙 적용
2. **프로필 이미지와 scroll-indicator의 z-index 충돌**
3. **모바일에서 hero-section 높이 축소로 인한 공간 부족**

### 해결 방안
1. **모바일용 scroll-indicator 위치 조정**
```css
@media (max-width: 767px) {
  .scroll-indicator {
    bottom: var(--spacing-sm);
    font-size: smaller;
  }
}
```

2. **z-index 우선순위 정리**
3. **모바일에서 scroll-indicator 숨김 처리 고려**

## 추천 해결책

### 1. 즉시 적용 가능한 해결책
- 모바일에서 scroll-indicator의 bottom 값을 더 작게 조정
- z-index 값 명시적 설정

### 2. 근본적 해결책  
- JavaScript에서 동적 위치 변경하는 코드가 있는지 확인
- 부모 요소의 positioning 재검토