# URL 섹션 디자인 개선 방안

## 현재 상황 분석

### 기존 URL 처리 방식
1. **단일 URL**: `<a>` 태그나 `<p>` 태그로 단순 처리
2. **여러 URL**: smartpod.html에서만 `<ul><li>` 구조로 처리
3. **서비스 종료**: `<p class="project-url">서비스 종료</p>`로 처리

### 문제점
- 일관성 없는 URL 표시 방식
- 여러 URL이 있을 때 구분이 어려움
- 시각적 계층구조가 불분명

## 개선 방안

### 1. 조건부 스타일링 CSS 추가

```css
/* 기존 단일 URL 스타일 유지 */
.project-url-section .project-url {
  font-size: var(--font-size-md);
  color: var(--color-text);
  margin: 0;
}

/* 여러 URL이 있을 때만 적용되는 리스트 스타일 */
.project-url-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-url-section li {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  border-left: 2px solid var(--color-primary);
  padding-left: var(--spacing-sm);
}

.project-url-section li:last-child {
  margin-bottom: 0;
}

.project-url-section li .project-url {
  display: block;
  margin-top: 4px;
  color: var(--color-secondary);
  text-decoration: none;
  word-break: break-all;
}

.project-url-section li .project-url:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
```

### 2. HTML 구조 표준화

#### 단일 URL (기존 방식 유지)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <a class="project-url" href="..." target="_blank">https://...</a>
</div>
```

#### 여러 URL (smartpod.html 방식 표준화)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <ul>
        <li>
            설명 텍스트
            <a class="project-url" href="..." target="_blank">https://...</a>
        </li>
        <li>
            설명 텍스트
            <a class="project-url" href="..." target="_blank">https://...</a>
        </li>
    </ul>
</div>
```

#### 서비스 종료 (기존 방식 유지)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <p class="project-url">서비스 종료</p>
</div>
```

### 3. 적용 대상 파일

1. **smartpod.html** - 이미 적용됨 (기준)
2. **smartpod-gccell.html** - 확인 필요
3. **dikidiki.html** - 단일 URL, 현재 방식 유지
4. **healingfesta-2021.html** - 서비스 종료, 현재 방식 유지  
5. **o2meet.html** - 서비스 종료, 현재 방식 유지

### 4. 구현 원칙

1. **내용 변경 금지**: 기존 텍스트나 URL 정보는 절대 수정하지 않음
2. **구조만 변경**: HTML 태그 구조만 표준화
3. **점진적 적용**: 여러 URL이 있는 경우에만 리스트 구조 적용
4. **기존 디자인 유지**: 현재 CSS 스타일과 충돌하지 않도록 조정

### 5. 실행 계획

1. 기존 CSS 스타일 분석 완료
2. 조건부 CSS 스타일 추가
3. 여러 URL이 있는 파일만 선별적으로 HTML 구조 변경
4. 테스트 및 검증

## 주의사항

- **절대 내용 변경 금지**: URL 주소, 설명 텍스트, 서비스 상태 등 기존 정보는 수정하지 않음
- **기존 스타일 유지**: 단일 URL이나 서비스 종료 표시는 기존 방식 그대로 유지
- **점진적 개선**: 한 번에 모든 것을 바꾸지 말고 필요한 부분만 선별적으로 개선