# 디키디키 프로젝트 재구조화 분석

## 1. 노션 사이트 재분석 결과

### 기본 정보
- **제목**: 디키디키
- **기간**: 2019.01 ~ 2021.12
- **설명**: DDP에 위치한 어린이 놀이터로 티켓 예약, 이벤트 안내, 어린이 놀이 범위 리포트를 보여주는 웹 프로젝트
- **팀 구성**: 총 3명 (운영팀 2명, 개발팀 1명)
- **기술 스택**: Java 8, JavaScript(ES5), SQL, JSP, SpringFramework, MyBatis, JQuery, Linux, MariaDB
- **웹사이트**: https://dikidiki.co.kr
- **기여도**: 0.7 (70%)

### 상세 내용 누락 문제
- 토글을 열었음에도 불구하고 주요 업무, 상세 업무, 성과, 느낀 점 등의 구체적인 내용이 WebFetch로 추출되지 않음
- 기본 정보만 확인 가능한 상태

## 2. 현재 구조 문제점 분석

### 이중 구조로 인한 문제
1. **데이터 중복**: 같은 프로젝트 정보가 두 곳에 존재
   - `views/ezpmp/dikidiki.html`: 정적 상세 페이지
   - `main.js`의 `projectData.dikidiki`: 모달용 데이터

2. **일관성 유지 비용**: 정보 변경 시 두 곳 모두 수정 필요

3. **사용자 경험 혼재**: 
   - 메인 페이지 카드 클릭 → JavaScript 모달
   - 직접 URL 접근 → HTML 페이지
   - 두 경로에서 다른 정보 제공 가능성

## 3. 해결방안 제안

### 옵션 A: JavaScript 모달 중심 구조 (권장)
**선택 이유:**
- 현재 포트폴리오 사이트의 주요 UX 패턴이 모달 기반
- 다른 프로젝트들과의 일관성 유지
- SPA(Single Page Application) 경험 제공

**구현 방안:**
1. `main.js`의 `projectData.dikidiki` 객체를 노션 내용으로 완전 업데이트
2. `views/ezpmp/dikidiki.html` 파일 삭제 또는 redirect 처리
3. 프로젝트 카드 클릭 시 모달에서 모든 상세 정보 표시

**장점:**
- 단일 데이터 소스로 관리 간편
- 일관성 보장
- 개발/유지보수 효율성
- 빠른 사용자 경험

**단점:**
- 독립 URL 없음 (SEO 불리)
- 직접 링크 공유 불가

### 옵션 B: HTML 페이지 중심 구조
**구현 방안:**
1. `views/ezpmp/dikidiki.html`을 노션 내용으로 완전 업데이트
2. `main.js`의 `projectData.dikidiki` 삭제
3. 프로젝트 카드 클릭 시 HTML 페이지로 이동

**장점:**
- SEO 최적화
- 독립 URL로 직접 공유 가능
- 상세 정보 제공에 유리

**단점:**
- 모달의 빠른 미리보기 경험 상실
- 다른 프로젝트들과의 UX 불일치

## 4. 삭제 시 발생 가능한 문제점

### dikidiki.html 삭제 시
- **문제점**: 기존 북마크나 직접 링크 접근 시 404 오류
- **해결책**: 301 redirect로 메인 페이지로 이동 처리

### main.js의 dikidiki 데이터 삭제 시  
- **문제점**: 메인 페이지에서 프로젝트 카드 클릭 시 모달 오류 발생
- **해결책**: 프로젝트 카드를 HTML 페이지 링크로 변경

### 현재 프로젝트 카드 구조
```html
<!-- views/cement/projects.html -->
<div class="project-card" data-project-id="dikidiki">
```
이 구조는 JavaScript 모달을 전제로 설계됨

## 5. 최종 권장사항

**옵션 A (JavaScript 모달 중심) 선택 권장**

**이유:**
1. 현재 포트폴리오의 전체적인 UX 패턴과 일치
2. 다른 프로젝트들(smartpod, gccell, o2meet, healingfesta)과의 일관성
3. 관리 효율성 (단일 데이터 소스)
4. 사용자 경험 최적화 (빠른 로딩, 페이지 이동 없음)

**실행 계획:**
1. 노션 내용을 기반으로 `main.js`의 `projectData.dikidiki` 완전 재작성
2. `views/ezpmp/dikidiki.html` 삭제
3. 만약 상세 내용이 더 필요하다면 JavaScript 모달 크기 확장 고려

**주의사항:**
- 노션에서 상세 내용 추출이 어려운 경우, 기본 정보만으로 모달 구성
- 향후 내용 추가 시 `main.js`만 수정하면 됨