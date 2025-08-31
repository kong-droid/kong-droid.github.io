# 공미향 포트폴리오 웹사이트 구성 계획

## 📁 디렉토리 구조
```
src/
├── public/
│   ├── css/
│   │   ├── common.css          # 공통 스타일
│   │   ├── main.css            # 메인 페이지 스타일
│   │   └── project.css         # 프로젝트 상세 스타일
│   └── images/
│       ├── profile/            # 프로필 이미지
│       ├── projects/           # 프로젝트 스크린샷
│       └── icons/              # 아이콘 및 로고
└── views/
    ├── thermolab/              # 써모랩코리아 (2023.04~현재)
    │   ├── smartpod.html
    │   ├── smartpod.js
    │   ├── gc-cell.html
    │   └── gc-cell.js
    ├── ezpmp/                  # 이즈피엠피 (2020.10~2023.02)
    │   ├── o2meet.html
    │   ├── o2meet.js
    │   ├── healing-festa.html
    │   └── healing-festa.js
    └── dikidiki/               # 디키디키 (2019.10~2021.12)
        ├── dikidiki.html
        └── dikidiki.js
```

## 🎯 메인 페이지 구성 (index.html)

### 1. Hero Section
- **시나리오를 작성하는 개발자 공미향** 타이틀
- 프로필 이미지 및 핵심 한 줄 소개
- GitHub, 포트폴리오 PDF 다운로드 링크

### 2. About Me
- **간략 소개**: "시나리오를 작성하는 개발자"로서의 정체성 강조
- **핵심 키워드**: 
  - 문제 해결 시나리오 작성
  - 자동화 및 효율성 개선
  - 크로스 도메인 경험 (MICE → 물류/패키징)

### 3. Technical Skills
- **백엔드**: Java, Kotlin, Spring Boot, Spring JPA
- **프론트엔드**: JavaScript(ES6), React.js, Node.js
- **데이터베이스**: PostgreSQL, MySQL, MariaDB
- **클라우드/인프라**: AWS (EC2, S3, RDS, Lambda, CloudFront, IoT Core)
- **DevOps**: GitHub Actions, Jenkins, CI/CD

### 4. Career Timeline
- **써모랩코리아** (2023.04 ~ 현재): 데이터 로거 & 관제 시스템
- **이즈피엠피** (2020.10 ~ 2023.02): 디지털 박람회 플랫폼
- **학습 기간** (2019.10 ~ 2020.04): Java 웹&앱 개발 과정

## 📋 프로젝트 상세 페이지 구성

### 써모랩코리아 프로젝트

#### 1. 스마트팟 (smartpod.html)
**프로젝트 개요**
- 데이터 로거의 실시간 온도 집계 모바일 서버
- 집계된 데이터 확인 관제 시스템

**핵심 성과**
- RDS 비용 50% 절감 (서버 최적화)
- 재사용성 70% 향상 (공통 모듈화)
- 데이터 조회 속도 3초 → 0.5초 개선
- 무중단 배포 환경 구축

**기술 스택**
- Backend: Java, Spring Boot, JPA, PostgreSQL
- Infrastructure: AWS (EC2, S3, RDS, Lambda, CloudFront, IoT Core)
- CI/CD: GitHub Actions

**상세 기능**
- 실시간 LTE 통신 데이터 로거 연동
- Excel/PDF 레포트 자동 생성
- WebClient 비동기 실시간 데이터 전송
- 쿼리 최적화 및 인덱싱

#### 2. GC CELL 중계 서버 (gc-cell.html)
**프로젝트 개요**
- GC CELL 서버 실시간 온도 데이터 전송 시스템

**핵심 성과**
- 220대 이상 데이터 로거 판매 달성
- 고객사 추가 구매 가능성 확보

### 이즈피엠피 프로젝트

#### 1. 오투미트 (o2meet.html)
**프로젝트 개요**
- 디지털 박람회 자동 생성 플랫폼
- "관리자 웹에서 행사를 자동으로 생성" 아이디어 제안 및 구현

**핵심 성과**
- 조회 속도 40초 → 1초로 개선 (쿼리 최적화)
- SSO 로그인 토큰 시스템 구축
- 도메인별 행사 이동 기능으로 리소스 효율성 향상

**기술적 도전**
- 파일 첨부 데이터 경로 규칙화로 일관성 확보
- 집계 정보 엑셀 다운로드 자동화

#### 2. 힐링페스타 경주 (healing-festa.html)
**프로젝트 개요**
- React.js 기반 모바일 강의 결제 시스템

**핵심 성과**
- MSA 방식 결제 모듈 구현
- PG사 연동 오류 없는 결제 시스템 구축

## 🎨 디자인 컨셉

### 색상 팔레트
- **Primary**: #2C3E50 (진한 네이비) - 신뢰성, 전문성
- **Secondary**: #3498DB (밝은 블루) - 기술, 혁신
- **Accent**: #E74C3C (레드) - 포인트, 강조
- **Text**: #34495E (다크 그레이)
- **Background**: #FFFFFF, #F8F9FA

### 타이포그래피
- **제목**: Noto Sans KR Bold
- **본문**: Noto Sans KR Regular
- **코드**: Fira Code (기술 스택 표시용)

### 레이아웃 특징
- **모바일 퍼스트** 반응형 디자인
- **카드 기반** 프로젝트 레이아웃
- **타임라인** 형태 경력 표시
- **호버 애니메이션** 인터랙션 효과

## 📊 성과 지표 시각화

### 대시보드 스타일 성과 표시
- 비용 절감: **50% RDS 비용 감소**
- 성능 개선: **3초 → 0.5초** 조회 속도
- 재사용성: **70% 향상**
- 매출 기여: **220대+ 데이터 로거 판매**

## 🔗 외부 링크 연동

### 실제 서비스 링크
- 스마트팟 관제: https://cloud.smartpod.co.kr/login
- 스마트팟 페이퍼: https://paper.smartpod.co.kr/login
- 모바일 앱: Google Play Store 링크
- 오투미트: https://o2meet.io
- 디키디키: https://dikidiki.co.kr

### GitHub 포트폴리오
- 메인 GitHub: https://github.com/kong-droid
- 상세 포트폴리오: Notion 링크

## 🚀 개발 우선순위

### Phase 1: 기본 구조
1. 메인 페이지 HTML/CSS 구조
2. 반응형 레이아웃 구현
3. 네비게이션 및 기본 라우팅

### Phase 2: 콘텐츠 구현
1. 써모랩 프로젝트 상세 페이지
2. 이즈피엠피 프로젝트 상세 페이지
3. 이미지 및 스크린샷 최적화

### Phase 3: 고도화
1. 인터랙션 애니메이션
2. SEO 최적화
3. 성능 최적화 및 배포

## 💡 차별화 포인트

### 1. "시나리오 작성" 개발자 브랜딩
- 문제 해결 과정을 스토리텔링으로 표현
- 기술적 도전과 해결책을 시나리오 형태로 구성

### 2. 실무 중심 성과 어필
- 구체적인 수치와 결과 중심 서술
- 실제 운영 중인 서비스 링크 제공

### 3. 크로스 도메인 경험 강조
- MICE → 물류/패키징 도메인 확장 경험
- 다양한 업계에서의 적응력 어필

### 4. 자동화 및 효율성 개선 사례
- 시연 웹 제작 → 기획팀 제안 → 실제 기능 개발
- 성능 최적화 및 비용 절감 성과