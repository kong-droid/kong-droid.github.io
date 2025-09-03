# Info-Value 텍스트 정렬 개선 방안

## 현재 문제점

`about.html`의 기본 정보 섹션에서 `info-value` 요소들이 다음과 같은 문제를 보입니다:

- **현재 CSS 구조** (`main.css:432-452`):
  ```css
  .info-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .info-value {
    font-weight: var(--font-weight-medium);
    color: var(--color-secondary);
  }
  ```

- **문제 상황**: 텍스트가 길어지면 `justify-content: space-between`과 기본 텍스트 정렬로 인해 오른쪽 끝에서 정렬이 깨지는 현상

## 개선 방안

### 방안 1: 텍스트 정렬 명시적 설정
```css
.info-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  text-align: right;
  max-width: 60%; /* 너비 제한으로 줄바꿈 유도 */
  word-wrap: break-word; /* 긴 단어 강제 줄바꿈 */
}
```

### 방안 2: Flexbox 속성 추가
```css
.info-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  text-align: right;
  flex: 1;
  margin-left: var(--spacing-md);
}

.info-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  flex-shrink: 0; /* 라벨 크기 고정 */
}
```

### 방안 3: 반응형 개선 (권장)
```css
.info-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  text-align: right;
  flex: 1;
  margin-left: var(--spacing-md);
  min-width: 0; /* flex 자식 요소의 최소 너비 제거 */
}

/* 모바일에서는 세로 정렬로 변경 */
@media (max-width: 768px) {
  .info-list li {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-value {
    text-align: left;
    margin-left: 0;
    margin-top: var(--spacing-xs);
    width: 100%;
  }
}
```

## 스타일 변경 시 잠재적 부작용

### 영향 범위 분석

1. **같은 CSS 클래스 사용하는 다른 컴포넌트**:
   - 현재 `info-value` 클래스는 `about.html`에서만 사용됨
   - 다른 섹션에서는 사용하지 않음 (확인 완료)

2. **레이아웃 변경으로 인한 영향**:
   ```
   영향 요소: .info-list li (main.css:432)
   - justify-content: space-between 변경 시
   - 전체 정보 리스트의 간격과 정렬에 영향
   ```

3. **반응형 디자인 영향**:
   - 현재 모바일 스타일이 별도로 정의되지 않음
   - 새로운 모바일 스타일 추가 시 기존 레이아웃과 충돌 가능성

### 주의사항

1. **텍스트 길이별 테스트 필요**:
   - 짧은 텍스트: "공미향"
   - 중간 텍스트: "rhdalgid134@gmail.com"  
   - 긴 텍스트: "이젠컴퓨터학원 안양<br>자바 안드로이드 웹&앱 개발자 과정"

2. **CSS 변수 의존성**:
   - `var(--spacing-md)`, `var(--color-secondary)` 등 CSS 변수 사용
   - `common.css`에서 정의된 변수들과 일치해야 함

3. **브라우저 호환성**:
   - `flex` 속성과 `text-align` 조합
   - `word-wrap: break-word` 구 브라우저 지원

### 권장 구현 순서

1. 방안 3 (반응형 개선) 적용
2. 다양한 텍스트 길이로 테스트
3. 모바일/데스크톱 환경에서 확인
4. 필요 시 `max-width` 값 조정

## 결론

현재 문제는 `justify-content: space-between`과 명시적 텍스트 정렬 부재로 발생합니다. 방안 3을 통해 데스크톱에서는 우측 정렬을 유지하면서 긴 텍스트 처리를 개선하고, 모바일에서는 세로 배치로 가독성을 높일 수 있습니다.