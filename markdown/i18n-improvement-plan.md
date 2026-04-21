# 포트폴리오 사이트 다국어 지원 개선안

## 개요
한국, 일본, 글로벌 취업 시장을 타겟으로 한국어(KR), 일본어(JP), 영어(EN) 간 언어 전환 기능을 구현합니다.

---

## 1. 요구사항 분석

### 기능 요구사항
- ✅ 한국어 ↔ 일본어 ↔ 영어 실시간 전환
- ✅ 사용자 선택 언어 브라우저 저장 (localStorage)
- ✅ 초기 로드 시 브라우저 언어 감지 및 자동 설정
- ✅ URL 파라미터를 통한 언어 지정 가능 (`?lang=jp`, `?lang=en`)
- ✅ SEO 최적화 (lang 속성, hreflang 태그)

### 비기능 요구사항
- 기존 컴포넌트 시스템과 호환
- 최소한의 성능 영향
- 유지보수 용이성 (번역 파일 분리)

---

## 2. 설계 방안

### 2.1 아키텍처 선택

#### 방안 A: JSON 기반 클라이언트 사이드 번역 ⭐ **추천**
**구조:**
```
public/
├── i18n/
│   ├── ko.json          # 한국어 번역
│   ├── ja.json          # 일본어 번역
│   ├── en.json          # 영어 번역
│   └── i18n.js          # 번역 엔진
```

**장점:**
- 기존 구조 변경 최소화
- 빠른 언어 전환 (새로고침 불필요)
- 번역 관리 용이 (JSON 파일만 수정)
- 배포 간편 (정적 호스팅 그대로 사용)

**단점:**
- 초기 로드 시 번역 파일 다운로드 필요
- SEO 크롤러가 JavaScript 실행 필요 (Google은 문제없음)

---

#### 방안 B: HTML 파일 복제 방식
**구조:**
```
views/
├── cement-kr/          # 한국어 컴포넌트
│   ├── header.html
│   └── ...
├── cement-jp/          # 일본어 컴포넌트
│   ├── header.html
│   └── ...
```

**장점:**
- SEO 최적화 (정적 HTML)
- JavaScript 없이도 작동

**단점:**
- 파일 관리 복잡도 2배
- 번역 수정 시 여러 파일 수정 필요
- 유지보수 어려움

---

### 2.2 선택: 방안 A (JSON 기반)
- 현재 컴포넌트 시스템과 자연스럽게 통합
- GitHub Pages 환경에 최적
- 번역 작업 효율성

---

## 3. 구현 계획

### 3.1 파일 구조
```
kong-droid.github.io/
├── index.html
├── public/
│   ├── i18n/
│   │   ├── ko.json              # 한국어 번역 데이터
│   │   ├── ja.json              # 일본어 번역 데이터
│   │   ├── en.json              # 영어 번역 데이터
│   │   └── i18n.js              # 번역 엔진 + 언어 전환 로직
│   ├── js/
│   │   ├── component-loader.js  # (수정) i18n 통합
│   │   └── main.js              # (수정) 번역 초기화
│   └── css/
│       └── i18n.css             # 언어 스위처 스타일
└── views/
    └── cement/
        ├── header.html          # (수정) 언어 스위처 추가
        └── ...                  # (수정) data-i18n 속성 추가
```

---

### 3.2 번역 데이터 구조 (JSON)

**kr.json 예시:**
```json
{
  "nav": {
    "about": "소개",
    "skills": "기술",
    "experience": "경력",
    "projects": "프로젝트",
    "contact": "연락"
  },
  "hero": {
    "greeting": "안녕하세요, 저는",
    "name": "공미향",
    "title": "백엔드 개발자",
    "subtitle": "시나리오 기반 문제 해결 전문"
  },
  "about": {
    "title": "소개",
    "description": "저는 백엔드 개발자로서..."
  }
  // ... 전체 콘텐츠
}
```

**ja.json 예시:**
```json
{
  "nav": {
    "about": "紹介",
    "skills": "スキル",
    "experience": "経歴",
    "projects": "プロジェクト",
    "contact": "お問い合わせ"
  },
  "hero": {
    "greeting": "こんにちは、私は",
    "name": "コン・ミヒャン",
    "title": "バックエンド開発者",
    "subtitle": "シナリオベース問題解決の専門家"
  }
  // ...
}
```

**en.json 예시:**
```json
{
  "nav": {
    "about": "About",
    "skills": "Skills",
    "experience": "Experience",
    "projects": "Projects",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Hi, I'm",
    "name": "Kong Mi-hyang",
    "title": "Backend Developer",
    "subtitle": "Specialist in Scenario-Based Problem Solving"
  },
  "about": {
    "title": "About",
    "description": "I'm a backend developer who..."
  }
  // ...
}
```

---

### 3.3 HTML 마크업 변경

**기존:**
```html
<h1>소개</h1>
<p>저는 백엔드 개발자입니다</p>
```

**변경 후:**
```html
<h1 data-i18n="about.title">소개</h1>
<p data-i18n="about.description">저는 백엔드 개발자입니다</p>
```

**언어 스위처 (header.html에 추가):**
```html
<div class="language-switcher">
  <button id="lang-ko" class="lang-btn active" data-lang="ko">
    <span class="flag">🇰🇷</span> KO
  </button>
  <button id="lang-ja" class="lang-btn" data-lang="ja">
    <span class="flag">🇯🇵</span> JA
  </button>
  <button id="lang-en" class="lang-btn" data-lang="en">
    <span class="flag">🇺🇸</span> EN
  </button>
</div>
```

---

### 3.4 번역 엔진 (i18n.js)

```javascript
// public/i18n/i18n.js
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.fallbackLang = 'ko';
  }

  // 언어 감지 우선순위: URL > localStorage > Browser > 기본값(ko)
  detectLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['ko', 'ja', 'en'].includes(urlLang)) {
      return urlLang;
    }

    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang && ['ko', 'ja', 'en'].includes(storedLang)) {
      return storedLang;
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('en')) return 'en';
    return 'ko';
  }

  // 번역 파일 로드
  async loadTranslations(lang) {
    if (this.translations[lang]) {
      return this.translations[lang];
    }

    try {
      const response = await fetch(`/public/i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`Error loading ${lang} translations:`, error);
      if (lang !== this.fallbackLang) {
        return this.loadTranslations(this.fallbackLang);
      }
      return {};
    }
  }

  // 번역 텍스트 가져오기
  t(key, lang = this.currentLang) {
    const keys = key.split('.');
    let value = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // 키를 찾지 못하면 키 자체 반환
      }
    }

    return value || key;
  }

  // 페이지 전체 번역 적용
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      // placeholder, title 등 속성 번역
      if (element.hasAttribute('data-i18n-placeholder')) {
        element.placeholder = translation;
      } else if (element.hasAttribute('data-i18n-title')) {
        element.title = translation;
      } else {
        element.textContent = translation;
      }
    });

    // HTML lang 속성 변경
    document.documentElement.lang = this.currentLang;
  }

  // 언어 변경
  async changeLanguage(lang) {
    if (!['ko', 'ja', 'en'].includes(lang)) {
      console.error('Unsupported language:', lang);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    await this.loadTranslations(lang);
    this.translatePage();
    this.updateLanguageSwitcher();

    // 커스텀 이벤트 발생 (다른 컴포넌트가 반응할 수 있도록)
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { lang }
    }));
  }

  // 언어 스위처 UI 업데이트
  updateLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add('active');
      }
    });
  }

  // 초기화
  async init() {
    await this.loadTranslations(this.currentLang);

    // 폴백 언어도 미리 로드
    if (this.currentLang !== this.fallbackLang) {
      await this.loadTranslations(this.fallbackLang);
    }

    this.translatePage();
    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        this.changeLanguage(lang);
      });
    });
  }
}

// 전역 인스턴스 생성
window.i18n = new I18n();
```

---

### 3.5 컴포넌트 로더 통합

**component-loader.js 수정:**
```javascript
// 기존 initializePortfolioAfterComponents 함수 수정
async function initializePortfolioAfterComponents() {
  // 1. i18n 초기화 (최우선)
  if (window.i18n) {
    await window.i18n.init();
  }

  // 2. 기존 초기화 로직
  initializeNavigation();
  initializeAnimations();
  // ...
}
```

---

### 3.6 SEO 최적화

**index.html에 추가:**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
  <!-- 대체 언어 페이지 힌트 -->
  <link rel="alternate" hreflang="ko" href="https://kong-droid.github.io/?lang=ko" />
  <link rel="alternate" hreflang="ja" href="https://kong-droid.github.io/?lang=ja" />
  <link rel="alternate" hreflang="en" href="https://kong-droid.github.io/?lang=en" />
  <link rel="alternate" hreflang="x-default" href="https://kong-droid.github.io/" />

  <!-- OG 태그도 동적 변경 가능하도록 data-i18n 속성 추가 -->
  <meta property="og:title" content="공미향 - 백엔드 개발자" data-i18n-content="meta.ogTitle">
  <meta property="og:description" content="..." data-i18n-content="meta.ogDescription">
</head>
```

---

### 3.7 스타일링 (i18n.css)

```css
/* 언어 스위처 */
.language-switcher {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--text-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.lang-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.lang-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.lang-btn .flag {
  font-size: 1.2em;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .language-switcher {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  .lang-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

/* 일본어 폰트 최적화 */
html[lang="ja"] {
  font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
}

/* 일본어일 때 줄 간격 조정 */
html[lang="ja"] body {
  line-height: 1.8;
}

/* 영어 폰트 최적화 */
html[lang="en"] {
  font-family: 'Inter', 'Roboto', 'Noto Sans', sans-serif;
}
```

---

## 4. 구현 단계

### Phase 1: 기반 구축 (1-2일)
1. ✅ `i18n.js` 번역 엔진 개발
2. ✅ 한국어 기준 `kr.json` 생성 (기존 콘텐츠 추출)
3. ✅ `component-loader.js` 통합
4. ✅ 언어 스위처 UI 구현

### Phase 2: 번역 작업 (3-4일)
1. ✅ `ja.json` 일본어 번역 작성
2. ✅ `en.json` 영어 번역 작성
3. ✅ 모든 HTML 컴포넌트에 `data-i18n` 속성 추가
4. ✅ 이미지 alt 텍스트, placeholder 등 속성 번역

### Phase 3: 테스트 및 최적화 (1-2일)
1. ✅ 언어 전환 동작 테스트
2. ✅ localStorage 저장/불러오기 검증
3. ✅ SEO 태그 동적 변경 확인
4. ✅ 모바일 반응형 테스트

### Phase 4: 배포 및 모니터링 (1일)
1. ✅ GitHub Pages 배포
2. ✅ Google Search Console 다국어 설정
3. ✅ 사용자 피드백 수집

---

## 5. 번역 관리 가이드

### 번역 파일 수정 방법
```bash
# 1. ko.json 수정 (한국어 원본)
# 2. ja.json에서 동일한 키 구조로 번역
# 3. 로컬 서버에서 테스트
# 4. 커밋 & 푸시
```

### 새 콘텐츠 추가 시
```javascript
// 1. ko.json, ja.json, en.json에 키 추가
// ko.json
{ "newSection": { "title": "새 섹션" } }

// ja.json
{ "newSection": { "title": "新しいセクション" } }

// en.json
{ "newSection": { "title": "New Section" } }

// 2. HTML에 data-i18n 속성 추가
<h2 data-i18n="newSection.title">새 섹션</h2>
```

---

## 6. 성능 고려사항

### 최적화 전략
- **번역 파일 캐싱**: localStorage에 번역 데이터 캐싱 (선택적)
- **지연 로딩**: 초기에는 현재 언어만 로드, 전환 시 다른 언어 로드
- **번들 크기**: JSON 파일 gzip 압축 (GitHub Pages 자동 지원)

### 예상 파일 크기
- `ko.json`: ~15-20KB
- `ja.json`: ~18-23KB (일본어가 약간 더 길 수 있음)
- `en.json`: ~12-18KB (영어는 짧은 표현 많음)
- `i18n.js`: ~5KB

**총 추가 로드**: ~30KB (첫 방문), ~5KB (재방문 시 캐시 활용)

---

## 7. 대안 검토

### 외부 라이브러리 사용 검토

#### i18next
- **장점**: 성숙한 생태계, 플러그인 풍부
- **단점**: 번들 크기 증가 (~30KB), 현 프로젝트에 오버스펙

#### FormatJS (react-intl)
- React 기반이므로 부적합

### 결론
- 현재 프로젝트는 바닐라 JS 기반 정적 사이트
- 커스텀 경량 솔루션이 가장 적합

---

## 8. 향후 확장 가능성

### 추가 언어 지원
```javascript
// 현재 지원 언어
const SUPPORTED_LANGUAGES = ['ko', 'ja', 'en'];

// 향후 중국어(ZH) 등 추가 시
// 1. public/i18n/zh.json 생성
// 2. SUPPORTED_LANGUAGES에 'zh' 추가
// 3. 언어 스위처에 버튼 추가
```

### 번역 관리 도구 도입
- **POEditor**, **Crowdin** 같은 번역 플랫폼 연동 가능
- JSON 파일 import/export 지원

---

## 9. 체크리스트

### 구현 전
- [ ] 기존 한국어 콘텐츠 JSON으로 추출
- [ ] 일본어 번역 준비 (전문 번역가 또는 DeepL/GPT 활용)
- [ ] 영어 번역 준비 (자연스러운 표현 및 기술 용어 통일)
- [ ] 일본 취업 시장 맞춤 표현 검토
- [ ] 영어권 취업 시장 맞춤 표현 검토

### 구현 중
- [ ] i18n.js 개발 및 테스트
- [ ] HTML 컴포넌트 data-i18n 속성 추가
- [ ] 언어 스위처 UI 구현
- [ ] 폰트 로딩 최적화 (Noto Sans JP 추가)

### 구현 후
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] 모바일 테스트 (iOS, Android)
- [ ] SEO 검증 (Google Search Console)
- [ ] 일본어 원어민 리뷰
- [ ] 영어 네이티브 리뷰 (또는 DeepL/GPT 품질 검토)

---

## 10. 참고 자료

### 일본 취업 시장 맞춤 팁
1. **경력 표현**
   - 한국: "~을 담당했습니다"
   - 일본: "~を担当いたしました" (겸양어 사용)

2. **기술 스택 표기**
   - 영문 그대로 사용 (Java, Spring Boot 등)
   - 일부 용어는 일본식 표현 (例: データベース)

3. **이력서 포맷**
   - 일본은 사진 선호, 생년월일 명시
   - 학력을 경력보다 위에 배치하는 경우 많음

### 유용한 도구
- **DeepL**: 한일/한영 번역 품질 우수
- **みんなの日本語**: 비즈니스 일본어 표현 참고
- **Wantedly**: 일본 IT 취업 플랫폼 (이력서 샘플 참고)
- **LinkedIn**: 영어권 개발자 프로필 표현 참고
- **Grammarly**: 영어 교정 도구

---

## 11. 예상 일정

| 단계 | 소요 시간 | 담당 |
|-----|---------|-----|
| 기반 구축 | 1-2일 | 개발 |
| 번역 작업 (KO+JA+EN) | 3-5일 | 번역 + 검수 |
| 테스트 | 1-2일 | 개발 + QA |
| 배포 | 0.5일 | DevOps |
| **총합** | **6-10일** | - |

---

## 12. 결론

이 개선안은 기존 컴포넌트 시스템을 유지하면서 효율적으로 다국어 지원을 추가할 수 있는 방법을 제시합니다.

**핵심 장점:**
✅ 정적 사이트 특성 유지
✅ 최소한의 코드 변경
✅ 번역 관리 용이성
✅ 확장 가능성 (KO/JA/EN 3개 언어, 향후 중국어 등 추가 가능)
✅ SEO 친화적

**다음 단계:**
1. 이 문서 검토 및 승인
2. Phase 1 개발 착수
3. 일본어 번역 준비 시작
