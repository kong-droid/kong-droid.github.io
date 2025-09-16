# URL 섹션 디자인 통일 방안

## 현재 문제점

### 기존 상황
- **단일 URL**: `<a>` 태그로 단순 표시
- **여러 URL**: `<ul><li>` 구조로 카드 형태 표시  
- **서비스 종료**: `<p>` 태그로 텍스트만 표시

### 문제점
- 같은 URL 섹션인데 디자인이 통일되지 않음
- 단일 URL과 여러 URL의 시각적 차이가 너무 큼
- 전체적인 일관성 부족

## 해결 방안

### 1. 모든 URL을 리스트 구조로 통일

모든 프로젝트 파일의 URL 섹션을 동일한 `<ul><li>` 구조로 변경하여 디자인 통일성 확보

#### 변경 전/후 비교

##### 단일 URL (기존)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <a class="project-url" href="https://dikidiki.co.kr" target="_blank">https://dikidiki.co.kr</a>
</div>
```

##### 단일 URL (변경 후)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <ul>
        <li>
            디키디키 공식 사이트
            <a class="project-url" href="https://dikidiki.co.kr" target="_blank">https://dikidiki.co.kr</a>
        </li>
    </ul>
</div>
```

##### 서비스 종료 (기존)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <p class="project-url">서비스 종료</p>
</div>
```

##### 서비스 종료 (변경 후)
```html
<div class="project-url-section">
    <h3>URL</h3>
    <ul>
        <li>
            <span class="project-url">서비스 종료</span>
        </li>
    </ul>
</div>
```

### 2. CSS 스타일 조정

기존 조건부 스타일을 모든 URL 섹션에 적용되도록 수정

```css
/* 모든 URL 섹션에 통일된 리스트 스타일 적용 */
.project-url-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-url-section li {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(var(--color-primary-rgb), 0.05);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
  transition: all 0.3s ease;
}

.project-url-section li:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  transform: translateX(2px);
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
  font-weight: var(--font-weight-medium);
}

.project-url-section li a.project-url:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* 서비스 종료용 span 스타일 */
.project-url-section li span.project-url {
  color: var(--color-text-light);
  font-style: italic;
}
```

### 3. 적용 대상 파일 및 변경 내용

#### views/thermolab/
1. **smartpod.html** - 이미 리스트 구조 (변경 없음)
2. **smartpod-gccell.html** - 단일 URL → 리스트 구조로 변경

#### views/ezpmp/
1. **dikidiki.html** - 단일 URL → 리스트 구조로 변경
2. **healingfesta-2021.html** - 서비스 종료 → 리스트 구조로 변경
3. **o2meet.html** - 서비스 종료 → 리스트 구조로 변경

### 4. 변경 원칙

1. **URL 주소 절대 변경 금지**: 기존 URL은 그대로 유지
2. **설명 텍스트 추가**: 각 URL에 적절한 설명 추가 (예: "공식 사이트", "안드로이드 앱")
3. **서비스 상태 유지**: 서비스 종료 정보는 그대로 유지하되 구조만 통일
4. **디자인 통일성**: 모든 URL 섹션이 동일한 카드 형태로 표시

### 5. 기대 효과

1. **시각적 일관성**: 모든 프로젝트 모달의 URL 섹션이 통일된 디자인
2. **사용자 경험 향상**: 예측 가능한 인터페이스로 사용성 개선
3. **정보 가독성 향상**: 카드 형태의 구조로 URL 정보가 더 명확하게 구분
4. **확장성**: 향후 URL이 추가될 때 일관된 방식으로 확장 가능

### 6. 구현 순서

1. CSS 스타일 수정 (기존 조건부 → 전체 적용)
2. smartpod-gccell.html 변경
3. ezpmp 폴더 내 3개 파일 변경
4. 테스트 및 검증

## 주의사항

- **절대 URL 주소 변경 금지**
- **기존 서비스 상태 정보 유지**  
- **적절한 설명 텍스트 추가로 사용자 이해도 향상**
- **모든 변경은 구조적 통일을 위한 것으로, 내용은 보존**