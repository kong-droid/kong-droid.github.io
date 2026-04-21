/**
 * I18n - 다국어 번역 엔진
 * 지원 언어: ko (한국어), ja (일본어), en (영어)
 */
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
    if (urlLang && ['ko', 'ja', 'en'].includes(urlLang)) return urlLang;

    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang && ['ko', 'ja', 'en'].includes(storedLang)) return storedLang;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('en')) return 'en';
    return 'ko';
  }

  // 번역 파일 로드
  async loadTranslations(lang) {
    if (this.translations[lang]) return this.translations[lang];

    try {
      const response = await fetch(`public/i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`Error loading ${lang} translations:`, error);
      if (lang !== this.fallbackLang) return this.loadTranslations(this.fallbackLang);
      return {};
    }
  }

  // 번역 텍스트 가져오기
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    for (const k of keys) {
      if (value && typeof value === 'object') value = value[k];
      else return key;
    }
    return value != null ? value : key;
  }

  // 페이지 전체 번역 적용
  translatePage() {
    // 일반 텍스트 번역
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });

    // HTML 포함 번역 (strong, br 태그 등)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });

    // aria-label 번역
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.getAttribute('data-i18n-aria')));
    });

    // alt 속성 번역
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      el.setAttribute('alt', this.t(el.getAttribute('data-i18n-alt')));
    });

    // 연도 형식 번역 (예: "5년+", "5年以上", "5+ yrs")
    document.querySelectorAll('[data-i18n-years]').forEach(el => {
      const n = el.getAttribute('data-i18n-years');
      const format = this.t('skills.yearsFormat');
      el.textContent = format.replace('{{n}}', n);
    });

    // HTML lang 속성 변경
    document.documentElement.lang = this.currentLang;

    // 언어 스위처 UI 업데이트
    this.updateLanguageSwitcher();
  }

  // 언어 변경
  async changeLanguage(lang) {
    if (!['ko', 'ja', 'en'].includes(lang)) return;

    this.currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    await this.loadTranslations(lang);
    this.translatePage();

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // 언어 스위처 UI 업데이트
  updateLanguageSwitcher() {
    const select = document.getElementById('langSelect');
    if (select) select.value = this.currentLang;
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    const select = document.getElementById('langSelect');
    if (select) {
      select.addEventListener('change', e => {
        this.changeLanguage(e.target.value);
      });
    }
  }

  // 초기화
  async init() {
    await this.loadTranslations(this.currentLang);

    // 폴백 언어 백그라운드 로드
    if (this.currentLang !== this.fallbackLang) {
      this.loadTranslations(this.fallbackLang);
    }

    this.translatePage();
    this.setupEventListeners();
  }
}

window.i18n = new I18n();
