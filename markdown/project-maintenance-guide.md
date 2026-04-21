# 포트폴리오 프로젝트 유지보수 가이드

작성일: 2026-04-22

---

## 1. 프로젝트 구조

### 1-1. 폴더 구조

```
kong-droid.github.io/
├── index.html                        # 메인 진입점 (플레이스홀더 구조)
├── public/
│   ├── css/
│   │   ├── common.css                # 전역 변수, 레이아웃, 그리드
│   │   ├── navigation.css            # 헤더 / 네비게이션 스타일
│   │   ├── main.css                  # 각 섹션 스타일
│   │   └── i18n.css                  # 언어 셀렉터, 언어별 폰트/크기 조절
│   ├── js/
│   │   ├── component-loader.js       # 컴포넌트 동적 로딩 + 초기화 진입점
│   │   ├── navigation.js             # 네비게이션 스크롤, 햄버거 메뉴
│   │   ├── main.js                   # 애니메이션, 프로젝트 모달(ProjectModal)
│   │   └── timeline-carousel.js      # 경력 타임라인 캐러셀
│   ├── i18n/
│   │   ├── i18n.js                   # 다국어 엔진 (I18n 클래스)
│   │   ├── ko.json                   # 한국어 번역
│   │   ├── ja.json                   # 일본어 번역
│   │   └── en.json                   # 영어 번역
│   └── images/
│       ├── profile/                  # 프로필 사진
│       └── projects/                 # 프로젝트 이미지
├── views/
│   ├── cement/                       # 메인 페이지 섹션 컴포넌트
│   │   ├── header.html
│   │   ├── hero.html
│   │   ├── about.html
│   │   ├── skills.html
│   │   ├── experience.html
│   │   ├── projects.html
│   │   └── footer.html
│   ├── thermolab/                    # 써모랩 프로젝트 모달 HTML
│   │   ├── smartpod.html
│   │   └── smartpod-gccell.html
│   └── ezpmp/                        # 이즈피엠피 프로젝트 모달 HTML
│       ├── o2meet.html
│       ├── healingfesta-2021.html
│       └── dikidiki.html
└── markdown/                         # 기획 및 분석 문서
```

### 1-2. 페이지 로딩 순서

```
index.html 파싱
  └─ <script> 태그 순서대로 로드
       ├─ public/i18n/i18n.js         → window.i18n 인스턴스 생성
       ├─ public/js/component-loader.js
       │    └─ DOMContentLoaded 이벤트
       │         ├─ header.html 로드 (순차 - 먼저)
       │         ├─ 나머지 6개 컴포넌트 병렬 로드
       │         └─ initializePortfolioAfterComponents()
       │              ├─ window.i18n.init()        ← i18n 최우선 초기화
       │              ├─ PortfolioNavigation 초기화
       │              ├─ PortfolioMain 초기화
       │              └─ 스크롤/카운터 애니메이션 초기화
       ├─ public/js/navigation.js
       ├─ public/js/timeline-carousel.js
       └─ public/js/main.js
            └─ allComponentsLoaded 이벤트
                 └─ ProjectModal 초기화
```

---

### 1-3. 다국어 처리 구조

#### 지원 언어
| 코드 | 언어 | 파일 |
|------|------|------|
| `ko` | 한국어 (기본값) | `public/i18n/ko.json` |
| `ja` | 일본어 | `public/i18n/ja.json` |
| `en` | 영어 | `public/i18n/en.json` |

#### 언어 감지 우선순위
```
URL 파라미터 (?lang=ko) > localStorage > 브라우저 언어 > 기본값(ko)
```

#### HTML 번역 어트리뷰트

| 어트리뷰트 | 대상 | 동작 |
|---|---|---|
| `data-i18n="key"` | 일반 텍스트 | `el.textContent = t(key)` |
| `data-i18n-html="key"` | HTML 포함 텍스트 (`<strong>`, `<br>` 등) | `el.innerHTML = t(key)` |
| `data-i18n-aria="key"` | aria-label 속성 | `el.setAttribute('aria-label', t(key))` |
| `data-i18n-alt="key"` | img alt 속성 | `el.setAttribute('alt', t(key))` |
| `data-i18n-years="N"` | 연도 표기 (N년+/N年以上/N+ yrs) | `format.replace('{{n}}', N)` |

#### JSON 키 구조
```
ko.json / ja.json / en.json
├── nav.*          헤더/모바일 네비게이션
├── hero.*         히어로 섹션
├── about.*        About Me 섹션
├── skills.*       Technical Skills (yearsFormat 포함)
├── experience.*   Career Timeline (thermolab, ezpmp, ezen)
├── projects.*     Projects 섹션 카드
├── footer.*       푸터
└── modal.*
    ├── label.*    모달 공통 라벨 (기간, 설명, 기술 스택 등)
    ├── smartpod.* 스마트팟 모달 내용
    ├── gccell.*   GC CELL 모달 내용
    ├── o2meet.*   오투미트 모달 내용
    ├── healingfesta.* 힐링페스타 모달 내용
    └── dikidiki.* 디키디키 모달 내용
```

#### 언어별 폰트 크기 조절 (`i18n.css`)
영어/일본어는 한국어 대비 텍스트 길이가 길어 About 섹션 등에서 레이아웃이 깨질 수 있으므로
`html[lang="en"]`, `html[lang="ja"]` 선택자로 개별 요소의 폰트 크기를 보정합니다.

```css
html[lang="en"] .highlight-text  { font-size: var(--font-size-lg); }
html[lang="en"] .section-subtitle { font-size: var(--font-size-sm); }
html[lang="en"] .about-story p   { font-size: var(--font-size-base); }
html[lang="en"] .values-list strong { font-size: var(--font-size-base); }
html[lang="ja"] .highlight-text  { font-size: var(--font-size-lg); }
```

---

### 1-4. 프로젝트 모달 관리

#### 모달 동작 흐름

```
프로젝트 카드 클릭
  └─ ProjectModal.openModal(projectId)
       ├─ loadModalContentFromHtml(projectId)
       │    ├─ fetch(views/{company}/{id}.html)
       │    ├─ modalContent.innerHTML = htmlContent
       │    ├─ extractAndSetModalHeader()  ← 기간, 제목 추출
       │    └─ window.i18n.translatePage() ← 삽입된 HTML에 번역 적용
       └─ 모달 표시
```

#### 프로젝트 ID ↔ HTML 경로 매핑 (`main.js` 내 `projectHtmlPaths`)

| projectId | HTML 파일 |
|---|---|
| `smartpod` | `views/thermolab/smartpod.html` |
| `gccell` | `views/thermolab/smartpod-gccell.html` |
| `o2meet` | `views/ezpmp/o2meet.html` |
| `healingfesta` | `views/ezpmp/healingfesta-2021.html` |
| `dikidiki` | `views/ezpmp/dikidiki.html` |

#### 모달 번역 처리 포인트
- 모달 HTML이 동적으로 삽입된 후 반드시 `i18n.translatePage()` 호출 필요
- 모달이 열린 상태에서 언어 변경 시 `languageChanged` 이벤트로 모달 제목 재번역
- 모달 HTML 파일 내 번역이 필요한 요소에는 `data-i18n` / `data-i18n-html` 어트리뷰트 부여

---

## 2. 유지보수 시 확인해야 할 사항 및 주요 코드

### 2-1. 텍스트 콘텐츠 변경 시

**모든 텍스트는 JSON 파일에서 관리합니다. HTML을 직접 수정하지 마세요.**

```
수정 파일: public/i18n/ko.json  (한국어)
           public/i18n/ja.json  (일본어)
           public/i18n/en.json  (영어)
```

- 한 언어만 수정하면 다른 언어에서 key 그대로 노출됨 → **3개 파일 동시 수정 필수**
- `data-i18n-html` 어트리뷰트를 사용하는 요소의 JSON 값에는 HTML 태그 포함 가능
- `<br>` 하드코딩은 영어에서 의도치 않은 줄바꿈을 유발할 수 있으므로 주의

### 2-2. 새 프로젝트 추가 시

1. `views/{회사}/` 에 모달 HTML 파일 생성
2. `main.js`의 `projectHtmlPaths` 객체에 경로 추가
3. `views/cement/projects.html`에 프로젝트 카드 추가 (`data-project-id` 필수)
4. `ko.json`, `ja.json`, `en.json`의 `projects.*` 섹션에 카드 텍스트 추가
5. `ko.json`, `ja.json`, `en.json`의 `modal.*` 섹션에 모달 내용 추가

### 2-3. 새 섹션 컴포넌트 추가 시

1. `views/cement/` 에 HTML 파일 생성
2. `index.html`에 플레이스홀더 `<div id="{name}-placeholder"></div>` 추가
3. `component-loader.js`의 `mainComponents` 배열에 경로/타겟 추가

### 2-4. 주요 코드 위치

| 기능 | 파일 | 위치 |
|---|---|---|
| 컴포넌트 로딩 순서 | `component-loader.js` | `DOMContentLoaded` 이벤트 (L157) |
| 초기화 순서 | `component-loader.js` | `initializePortfolioAfterComponents()` (L198) |
| 언어 감지 로직 | `i18n.js` | `detectLanguage()` (L13) |
| 번역 적용 | `i18n.js` | `translatePage()` (L55) |
| 언어 변경 + 이벤트 발행 | `i18n.js` | `changeLanguage()` (L91) |
| 모달 열기 | `main.js` | `ProjectModal.openModal()` (L464) |
| 모달 HTML 로드 + i18n | `main.js` | `loadModalContentFromHtml()` (L505) |
| 모달 제목 설정 | `main.js` | `extractAndSetModalHeader()` (L540) |
| 언어 변경 시 모달 제목 재번역 | `main.js` | `languageChanged` 이벤트 리스너 (L447) |

### 2-5. 로컬 실행 방법

```bash
# file:// 프로토콜 불가 — 반드시 HTTP 서버 필요
python -m http.server 8000
# 브라우저: http://localhost:8000

# 언어 직접 지정 테스트
# http://localhost:8000/?lang=ja
# http://localhost:8000/?lang=en
```

---

## 3. 프로젝트 개선사항

### 3-1. 소스 코드 개선할 점

#### (1) `index.html` 메타 태그 미갱신
타이틀/OG/description이 구 버전 문구(`시나리오를 작성하는 개발자`)로 남아 있음.
새 정체성(`인프라부터 API까지 직접 구축하는 개발자`)으로 업데이트 필요.

```html
<!-- 현재 (index.html) -->
<meta name="description" content="시나리오를 작성하는 개발자 공미향의 포트폴리오...">
<title>공미향 - 시나리오를 작성하는 개발자</title>
<meta property="og:title" content="공미향 - 시나리오를 작성하는 개발자">
```

#### (2) `extractAndSetModalHeader()`의 한국어 하드코딩
모달 제목 fallback으로 쓰이는 `projectTitles` 객체가 한국어로 고정되어 있음.
`window.i18n.t()`가 항상 먼저 시도되므로 실질적 문제는 없으나, 코드 정합성상 제거 권장.

```js
// main.js L550 — ko 하드코딩된 fallback
const projectTitles = {
  'smartpod': '스마트팟 (SmartPod)',
  ...
};
```

#### (3) `addPortfolioStyles()` — JS에 CSS 인라인 삽입
`component-loader.js` 내 `addPortfolioStyles()`가 JS에서 `<style>` 태그를 동적으로 생성하여 `<head>`에 삽입하는 구조.
애니메이션, 터치 최적화 등의 스타일이 포함되어 있어 CSS 파일로 분리하면 유지보수 개선.

#### (4) 반응형 브레이크포인트 중복
`component-loader.js`의 `addPortfolioStyles()` 내부와 `main.css` 양쪽에 `@media (max-width: 1024px)` 블록이 존재하여 관리 포인트가 분산됨.

#### (5) 네비게이션 메뉴 — `position: absolute` 중앙 배치
PC 해상도에서 `nav-menu`가 `position: absolute; left: 50%; transform: translateX(-50%)`으로 중앙 배치됨.
햄버거 메뉴가 표시되는 태블릿/모바일 분기점에서 `position` 해제 여부 미디어쿼리 확인 필요.

---

### 3-2. 다국어 처리 개선할 점

#### (1) `about.highlight`의 `<br>` 하드코딩
```json
"highlight": "\"도메인을 빠르게 장악하고<br>인프라부터 API까지 설계하는 개발자\""
```
CJK(한국어/일본어)는 문자 단위 줄바꿈으로 `<br>` 위치가 예측 가능하지만,
영어는 단어 단위 래핑이라 `<br>`와 충돌 시 빈 줄이 생기거나 정렬이 어색해짐.

**권장:** `<br>` 제거 후 CSS `max-width` + `word-break: keep-all`로 제어.

#### (2) `about.subtitle` 영문 문구 길이
```json
"subtitle": "A Developer Who Builds From Infrastructure to API"  // 50자
```
`section-subtitle`에 `font-size: var(--font-size-sm)`을 이미 적용했으나,
장기적으로는 `Infra to API Developer` 수준으로 짧게 유지하는 것이 레이아웃상 안전.

#### (3) JSON 유효성 검증 자동화 부재
3개 JSON 파일 중 하나에서 key가 누락되거나 오타가 발생해도 런타임에 key 이름이 그대로 노출될 뿐 에러가 나지 않음.
CI/CD 또는 커밋 전 단계에서 3개 JSON의 key 구조 일치 여부를 검증하는 스크립트 도입 권장.

```js
// 검증 스크립트 예시 (Node.js)
const ko = require('./public/i18n/ko.json');
const ja = require('./public/i18n/ja.json');
const en = require('./public/i18n/en.json');

function getKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && !Array.isArray(v)
      ? getKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );
}

const koKeys = getKeys(ko).sort();
const jaKeys = getKeys(ja).sort();
const enKeys = getKeys(en).sort();

const missing = koKeys.filter(k => !jaKeys.includes(k) || !enKeys.includes(k));
if (missing.length) console.error('누락된 키:', missing);
```

#### (4) `data-i18n-html` XSS 위험
`innerHTML`에 JSON 값을 직접 삽입하는 구조로, JSON 파일이 외부에서 수정 가능한 환경이라면 XSS 취약점이 될 수 있음.
현재는 정적 파일로만 운영되므로 실질적 위험은 없으나, 추후 CMS 연동 시 sanitize 처리 필요.

#### (5) 폴백(fallback) 언어 처리
번역 키 미존재 시 키 이름(`modal.smartpod.description`)이 그대로 노출됨.
`fallbackLang: 'ko'`가 설정되어 있으나 개별 키 단위 폴백이 아닌 파일 전체 로드 실패 시에만 동작.
키 단위로 `ko.json` 값을 폴백으로 반환하도록 `t()` 메서드 개선 권장.

```js
// 현재
t(key) {
  ...
  return value != null ? value : key; // 키 이름 노출
}

// 개선안
t(key) {
  ...
  if (value == null && this.currentLang !== this.fallbackLang) {
    // fallback ko 값 반환
    const keys = key.split('.');
    let fallback = this.translations[this.fallbackLang];
    for (const k of keys) fallback = fallback?.[k];
    return fallback ?? key;
  }
  return value ?? key;
}
```
