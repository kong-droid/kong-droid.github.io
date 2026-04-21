# i18n About 섹션 레이아웃 깨짐 분석 및 개선 방향

작성일: 2026-04-21

---

## 1. hero.description 문구 제거 검토

### 현재 문구
> "문제 해결의 과정을 문서로 기록하며, 사용자가 편한 시스템을 설계하는 백엔드 개발자입니다."

### 문제점
- 기존 정체성(`시나리오를 작성하는`)에 맞춰 작성된 문구로, 새 정체성(`인프라부터 API까지 직접 구축하는`)과 맞지 않음
- 제목(titleLine1/2)이 이미 정체성을 명확히 설명하므로 hero 설명 문구가 중복이자 약화 요소
- 영문 기준 약 80자로 모바일에서 2~3줄 렌더링

### 권장 조치
`hero.html`의 `.hero-description` `<p>` 태그 제거 또는 JSON 3개 모두 빈 문자열 처리.

---

## 2. About 섹션 깨짐 현상 원인 분석

### 2-1. `.about-highlight` (메인 인용구 박스)

**현재 CSS:**
```css
.highlight-text {
  font-size: var(--font-size-xl);  /* 20px */
  line-height: 1.4;
}
/* 모바일에서만 font-size-lg(18px)로 축소 */
```

**현재 JSON 텍스트 길이 비교:**

| 언어 | 텍스트 | 특이사항 |
|---|---|---|
| KO | `"실무에서 바로 쓰이는 사용자 중심<br>데이터 로거 시스템을 설계하는 개발자"` | `<br>` 수동 줄바꿈 |
| JA | `"現場ですぐに使えるユーザー中心の<br>データロガーシステムを設計するエンジニア"` | `<br>` 수동 줄바꿈, CJK 문자폭 동일 |
| EN | `"Designing user-centered data logger systems<br>that work in real-world environments"` | 단어 단위 래핑 + `<br>` 충돌 |

**문제:**
영어는 CJK(한국어/일본어)와 달리 **단어 단위로 줄바꿈**된다.
`<br>` 위치가 단어 래핑과 겹치면 기대한 레이아웃과 다르게 렌더링됨.
예: "systems" 뒤 `<br>` 직전에 이미 자동 줄바꿈이 발생 → 공백 줄이 생기거나 텍스트 정렬이 어색해짐.

---

### 2-2. `.about-subtitle` (섹션 서브타이틀)

**변경 후 텍스트 길이 비교:**

| 언어 | 문구 | 글자 수 |
|---|---|---|
| KO | `인프라부터 API까지 직접 구축하는 개발자` | 20자 |
| JA | `インフラからAPIまで自ら構築するエンジニア` | 21자 |
| EN | `A Developer Who Builds From Infrastructure to API` | 50자 |

**문제:**
`section-subtitle`에 고정된 폰트 크기와 `text-align: center`가 적용되어 있어,
영문 50자 문구가 컨테이너 너비에 따라 2줄로 줄바꿈됨 → 섹션 헤더 공간이 벌어짐.

---

### 2-3. `.about-story` (스토리 단락 2개)

**문제:**
About 섹션은 2-column 레이아웃 (`col-desktop-6 / col-desktop-6`).
왼쪽 컬럼: 스토리 + 핵심 가치 / 오른쪽 컬럼: 기본 정보 카드.

영문/일문 번역은 한국어보다 텍스트 양이 많아 **왼쪽 컬럼의 높이가 오른쪽보다 길어짐**.
특히 `story1`, `story2`의 영문 번역이 각각 1.5배 이상 길어 레이아웃 밸런스가 무너짐.

---

### 2-4. `.values-list strong` (핵심 가치 제목)

| 언어 | value1Title 길이 |
|---|---|
| KO | `인프라 구축 및 운영 효율화` - 짧음 |
| EN | `Problem-Solving Scenario Writing` - 단어 수 많음 |
| JA | `問題解決シナリオの作成` - 적당 |

영문에서 strong 텍스트가 2줄로 줄바꿈되면 카드 높이가 달라지고 3개 항목 높이가 불균일해짐.

---

## 3. 개선 방안 비교

### 방안 A — 폰트 크기 언어별 조절 (CSS)

```css
/* i18n.css에 추가 */
html[lang="en"] .highlight-text {
  font-size: var(--font-size-lg); /* 20px → 18px */
}
html[lang="en"] .section-subtitle {
  font-size: var(--font-size-sm); /* 텍스트 긴 경우 축소 */
}
html[lang="ja"] .highlight-text {
  font-size: var(--font-size-xl); /* 일본어는 현행 유지 */
}
```

**장점:** 빠름, HTML 변경 없음
**단점:** 미세 조정이 많아지면 유지보수 복잡도 증가

---

### 방안 B — 영문 JSON 텍스트 간결화

`about.highlight` EN 텍스트를 `<br>` 없이 짧게 재작성:
```
"Designing real-world infrastructure from API to cloud"
```

`about.story1/2` EN 텍스트를 압축 (현재 약 200자 → 120자 수준으로).

**장점:** CSS 변경 없음, 자연스러운 래핑
**단점:** 번역 품질 일부 손실, 수동 조정 필요

---

### 방안 C — `about.highlight` 구조 개선 (권장)

`<br>` 하드코딩 제거하고, CSS로 줄바꿈 제어:

```css
.highlight-text {
  max-width: 480px;
  margin: 0 auto;
  word-break: keep-all; /* KO/JA 단어 단위 보호 */
  overflow-wrap: break-word;
}
html[lang="en"] .highlight-text {
  font-size: var(--font-size-lg);
  max-width: 560px;
}
```

JSON에서 `<br>` 제거 후 자연 래핑에 맡김.

**장점:** 구조적으로 견고, 반응형 환경에서 안정적
**단점:** 한국어/일본어에서 줄바꿈 위치가 바뀔 수 있어 시각 확인 필요

---

### 방안 D — About 섹션 레이아웃 구조 변경

현재 2-column → 텍스트 영역을 상단 full-width로 분리하는 방식:
- 상단: highlight 박스 (full-width)
- 중단: story (full-width, 2열 X)
- 하단: 핵심 가치(왼) + 기본 정보(오) 2-column

**장점:** 언어 길이에 관계없이 안정적
**단점:** 디자인 변경 범위가 크고 리그레션 위험 있음

---

## 4. 권장 우선순위

| 항목 | 방안 | 난이도 | 효과 |
|---|---|---|---|
| hero.description 제거 | JSON 빈 문자열 또는 HTML 삭제 | 낮음 | 높음 |
| about.highlight `<br>` 제거 + CSS 조절 | 방안 C | 낮음 | 높음 |
| about.subtitle EN 문구 단축 | 방안 B | 낮음 | 중간 |
| about-story EN 텍스트 압축 | 방안 B | 중간 | 중간 |
| values-list 레이아웃 안정화 | 방안 A (lang별 font-size) | 낮음 | 중간 |

---

## 5. 결론

레이아웃 깨짐의 핵심 원인은 두 가지다:

1. **`<br>` 하드코딩** — CJK에서는 문자 단위 래핑이므로 `<br>` 위치가 예측 가능하지만, 영문은 단어 래핑과 충돌함
2. **텍스트 길이 차이** — 영문 번역이 한국어 대비 1.5~2배 길어 2-column 높이 밸런스 붕괴

즉각 적용 가능한 최소 변경은:
- `hero.description` 제거
- `about.highlight` JSON에서 `<br>` 제거 + `i18n.css`에 `html[lang="en"] .highlight-text { font-size: var(--font-size-lg); max-width: 560px; }` 추가
- `about.subtitle` EN 문구를 `Infra to API Developer`처럼 짧게 수정
