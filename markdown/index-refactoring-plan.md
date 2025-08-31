# index.html 분기 리팩토링 계획

## 현재 구조 분석
현재 index.html은 998줄의 단일 파일로 구성되어 있으며, 다음과 같은 주요 섹션들을 포함합니다:
- HTML head (메타데이터, 스타일시트, 파비콘)
- Header & Navigation (데스크톱/모바일 네비게이션)
- Main Content (Hero, About, Skills, Experience, Projects, Contact)
- Footer

## 프로젝트 구조 수정사항
### 1. 폴더 구조 개선
- **dikidiki → ezpmp 폴더 이동**: dikidiki는 이즈피엠피에서 진행한 프로젝트이므로 `src/views/ezpmp/dikidiki/` 로 이동
- **src 폴더 제거**: 루트에 바로 파일들 배치하여 구조 단순화
- **cement 폴더 생성**: `views/cement/` 폴더에 메인 페이지 컴포넌트들 관리

### 2. 새로운 폴더 구조
```
kong-droid.github.io/
├── index.html (루트 레벨로 이동)
├── public/
│   ├── css/
│   ├── images/
│   └── js/
└── views/
    ├── cement/           # 메인 페이지 컴포넌트들
    │   ├── header.html
    │   ├── nav-config.js
    │   ├── hero.html
    │   ├── about.html
    │   ├── skills.html
    │   ├── experience.html
    │   ├── projects.html
    │   ├── contact.html
    │   └── footer.html
    ├── ezpmp/            # 이즈피엠피 프로젝트들
    │   ├── dikidiki/     # 디키디키 프로젝트 (이동 예정)
    │   └── o2meet.html   # 오투미트 관련
    └── thermolab/        # 써모랩 프로젝트들
        ├── smartpod.html
        └── gc-cell.html
```

## 분기 계획

### 1. Header 분리 (`views/cement/header.html`)
**분리 범위**: 35-158줄
- 데스크톱 헤더 및 네비게이션 (36-91줄)
- 모바일 오버레이 및 네비게이션 (93-158줄)
- 로고, 메뉴 아이템, 햄버거 버튼, 모바일 소셜 링크 포함

### 2. Navigation 별도 관리 (`views/cement/nav-config.js`)
**목적**: 네비게이션 메뉴 데이터를 중앙 관리
- 메뉴 아이템 배열 (Home, About, Skills, Experience, Projects, Contact)
- 아이콘 정보 및 링크 데이터
- 모바일/데스크톱 공통 사용

### 3. Main Body Sections 분리
#### 3.1 Hero Section (`views/cement/hero.html`)
**분리 범위**: 163-231줄
- 인트로 텍스트, 프로필 이미지, 플로팅 엘리먼트
- 통계 정보, CTA 버튼

#### 3.2 About Section (`views/cement/about.html`)
**분리 범위**: 233-353줄
- 자기소개, 핵심 가치, 기본 정보
- 자격증 및 어학 정보

#### 3.3 Skills Section (`views/cement/skills.html`)
**분리 범위**: 355-574줄
- 기술 스택 그리드 (Backend, Database, Cloud, DevOps)
- 성취 통계

#### 3.4 Experience Section (`views/cement/experience.html`)
**분리 범위**: 576-724줄
- 경력 타임라인, 경력 요약

#### 3.5 Projects Section (`views/cement/projects.html`)
**분리 범위**: 726-832줄
- 주요 프로젝트 카드들, GitHub 링크

#### 3.6 Contact Section (`views/cement/contact.html`)
**분리 범위**: 834-941줄
- 연락처 정보, 메시지 폼

### 4. Footer 분리 (`views/cement/footer.html`)
**분리 범위**: 943-991줄
- 로고, 퀵 링크, 소셜 링크
- 저작권 정보

### 5. 새로운 index.html 구조 (루트 레벨)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- 현재 head 섹션 유지 (1-33줄) -->
  <!-- CSS 경로 수정: src/public/ → public/ -->
  <link rel="stylesheet" href="public/css/common.css">
  <link rel="stylesheet" href="public/css/navigation.css">
  <link rel="stylesheet" href="public/css/main.css">
  <link rel="icon" type="image/x-icon" href="public/images/icons/favicon.ico">
</head>
<body>
  <!-- Header 컴포넌트 삽입 -->
  <div id="header-placeholder"></div>
  
  <!-- Main Content -->
  <main class="main-content">
    <div id="hero-placeholder"></div>
    <div id="about-placeholder"></div>
    <div id="skills-placeholder"></div>
    <div id="experience-placeholder"></div>
    <div id="projects-placeholder"></div>
    <div id="contact-placeholder"></div>
  </main>

  <!-- Footer 컴포넌트 삽입 -->
  <div id="footer-placeholder"></div>

  <!-- Scripts -->
  <script src="public/js/component-loader.js"></script>
  <script src="public/js/navigation.js"></script>
  <script src="public/js/main.js"></script>
</body>
</html>
```

## 추가 개발 항목

### 6. Component Loader 생성 (`public/js/component-loader.js`)
- 각 HTML 컴포넌트를 동적으로 로드하는 함수
- placeholder 요소에 컴포넌트 삽입
- 에러 핸들링 및 로딩 상태 관리

### 7. 경로 수정 작업
- 모든 리소스 경로를 `src/public/` → `public/`로 수정
- 이미지 경로: `src/public/images/` → `public/images/`
- 프로젝트 상세 페이지 링크: `src/views/` → `views/`

### 8. 스타일 분리 검토
- 현재 CSS 파일들이 분리된 컴포넌트와 호환되는지 확인
- 필요시 컴포넌트별 CSS 모듈화

## 장점
1. **유지보수성**: 각 섹션별 독립적 수정 가능
2. **재사용성**: 컴포넌트 단위 재사용
3. **협업 효율성**: 개발자별 섹션 담당 가능
4. **로딩 최적화**: 필요한 컴포넌트만 로드 가능 (향후 확장)
5. **테스트 용이성**: 컴포넌트 단위 테스트 가능

## 주의사항
- 현재 CSS 클래스명과 JavaScript 이벤트 바인딩 유지
- SEO를 고려한 점진적 로딩 구현
- 브라우저 호환성 확인 (fetch API 사용)
- 로드 순서 및 의존성 관리

## 단계별 작업 순서
### Phase 1: 구조 재정비
1. **폴더 구조 변경**
   - `src/views/dikidiki/` → `views/ezpmp/dikidiki/` 이동
   - `src/` 폴더 제거 및 루트로 파일 이동
   - `views/cement/` 폴더 생성

### Phase 2: 컴포넌트 분리
2. Component Loader 개발 (`public/js/component-loader.js`)
3. Header 컴포넌트 분리 (`views/cement/header.html`)
4. Footer 컴포넌트 분리 (`views/cement/footer.html`)
5. Main 섹션들 순차적 분리 (Hero → About → Skills → Experience → Projects → Contact)

### Phase 3: 메인 페이지 재구성
6. 새로운 index.html 구성 (루트 레벨)
7. 모든 경로 수정 (`src/public/` → `public/`, `src/views/` → `views/`)

### Phase 4: 테스트 및 최적화
8. 기능 테스트 및 스타일 검증
9. 브라우저 호환성 확인
10. 성능 최적화