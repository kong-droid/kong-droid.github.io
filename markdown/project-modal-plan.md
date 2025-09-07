# 프로젝트 모달 팝업 구현 계획

## 현재 문제점
- 상세 페이지들이 별도 HTML 파일로 분리되어 메인 사이트 디자인과 분리됨
- 페이지 이동으로 인한 사용자 경험 단절
- 단일 페이지 애플리케이션 구조와 어울리지 않음

## 개선 방향
프로젝트 카드 클릭 시 모달 팝업으로 상세 정보를 표시하여 매끄러운 사용자 경험 제공

---

## 디자인 구조

### 1. 모달 오버레이
- **배경**: 반투명 다크 오버레이 (rgba(0,0,0,0.8))
- **크기**: 전체 화면 고정 위치 (position: fixed)
- **z-index**: 높은 값으로 설정하여 다른 요소들 위에 표시
- **닫기 방법**: 
  - 배경 클릭 시 닫기
  - ESC 키 누를 시 닫기
  - X 버튼 클릭 시 닫기

### 2. 모달 컨테이너
- **크기**: 최대 너비 800px, 높이는 콘텐츠에 따라 자동 조절
- **위치**: 화면 중앙 정렬 (transform: translate(-50%, -50%))
- **배경**: var(--color-bg-primary) (메인 사이트와 동일)
- **테두리**: 둥근 모서리 (border-radius: var(--border-radius-lg))
- **그림자**: 깊은 그림자 효과 (box-shadow: var(--shadow-xl))

### 3. 모달 헤더
- **구성**: 프로젝트 제목, 기간, 닫기 버튼
- **스타일**: 메인 사이트의 section-header와 유사한 스타일
- **닫기 버튼**: 우상단에 X 아이콘, 호버 효과 포함

### 4. 모달 콘텐츠
- **구성**: 
  - 프로젝트 이미지 (옵션)
  - 프로젝트 개요
  - 주요 기능 리스트
  - 기술 스택 태그
  - 성과/결과 (있는 경우)
- **스타일**: 메인 사이트와 일관된 타이포그래피 및 간격

### 5. 반응형 디자인
- **데스크톱**: 최대 800px 너비
- **태블릿**: 화면 너비의 90%, 좌우 여백 5%씩
- **모바일**: 화면 너비의 95%, 상하 스크롤 가능

---

## 화면 간 로직 구현

### 1. HTML 구조 추가
```html
<!-- 모달 구조를 index.html에 추가 -->
<div id="projectModal" class="project-modal hidden">
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title"></h2>
        <span class="modal-period"></span>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-content">
        <!-- 동적으로 콘텐츠 삽입 -->
      </div>
    </div>
  </div>
</div>
```

### 2. 프로젝트 데이터 구조
```javascript
const projectData = {
  'smartpod': {
    title: '스마트팟 (SmartPot)',
    period: '2023.04 ~ 진행중',
    description: '실시간 데이터 로거 온도 집계 및 관제 시스템',
    features: [
      '실시간 온도 데이터 수집 및 모니터링',
      '데이터 시각화 및 리포팅 시스템',
      '알림 및 경고 시스템',
      '사용자 관리 및 권한 제어'
    ],
    techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Docker'],
    achievements: ['RDS 비용 50% 절감', '조회속도 3초→0.5초 개선']
  },
  // ... 다른 프로젝트들
};
```

### 3. JavaScript 이벤트 처리
```javascript
// 모달 열기
function openProjectModal(projectId) {
  const modal = document.getElementById('projectModal');
  const data = projectData[projectId];
  
  // 모달 콘텐츠 동적 생성
  populateModalContent(data);
  
  // 모달 표시 (페이드인 애니메이션)
  modal.classList.remove('hidden');
  modal.classList.add('show');
  
  // 스크롤 잠금
  document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  
  // 페이드아웃 애니메이션
  modal.classList.remove('show');
  modal.classList.add('hidden');
  
  // 스크롤 복원
  document.body.style.overflow = '';
}
```

### 4. 이벤트 리스너 등록
- **카드 클릭**: 각 프로젝트 카드에 클릭 이벤트 추가
- **모달 닫기**: 
  - X 버튼 클릭
  - 오버레이 배경 클릭
  - ESC 키 입력
- **키보드 접근성**: Tab 키로 모달 내 포커스 이동

---

## 애니메이션 효과

### 1. 모달 등장 애니메이션
- **오버레이**: opacity 0 → 1 (0.3초)
- **컨테이너**: transform scale(0.8) → scale(1) + opacity 0 → 1 (0.3초)
- **easing**: ease-out

### 2. 모달 사라짐 애니메이션
- **컨테이너**: transform scale(1) → scale(0.8) + opacity 1 → 0 (0.2초)
- **오버레이**: opacity 1 → 0 (0.2초)
- **easing**: ease-in

### 3. 호버 효과
- **카드 호버**: "자세히 보기" 버튼에 미묘한 확대/색상 변화
- **닫기 버튼**: 호버 시 배경색 변화

---

## 구현 순서

### 1단계: HTML 구조 추가
- index.html에 모달 기본 구조 추가
- 프로젝트 카드에 data-project-id 속성 추가

### 2단계: CSS 스타일 작성
- 모달 기본 스타일 (hidden/show 상태)
- 애니메이션 효과
- 반응형 스타일

### 3단계: JavaScript 기능 구현
- 프로젝트 데이터 객체 생성
- 모달 열기/닫기 함수
- 동적 콘텐츠 생성 함수

### 4단계: 이벤트 리스너 연결
- 카드 클릭 이벤트
- 모달 닫기 이벤트들
- 키보드 이벤트

### 5단계: 기존 상세 페이지 제거
- views/thermolab/*.html 파일 삭제
- views/ezpmp/*.html 파일 삭제

---

## 접근성 고려사항

### 1. 키보드 내비게이션
- Tab 키로 모달 내 요소들 순회
- ESC 키로 모달 닫기
- Enter/Space로 버튼 활성화

### 2. 스크린 리더 지원
- aria-labelledby로 모달 제목 연결
- aria-describedby로 모달 설명 연결
- role="dialog" 속성 추가

### 3. 포커스 관리
- 모달 열 때 첫 번째 포커스 요소로 이동
- 모달 닫을 때 원래 트리거 요소로 포커스 복귀

---

## 예상 작업 시간
- HTML 구조 추가: 15분
- CSS 스타일링 및 애니메이션: 30분
- JavaScript 기능 구현: 45분
- 이벤트 연결 및 테스트: 20분
- 접근성 개선: 10분

**총 예상 시간**: 약 2시간

---

## 장점
- 단일 페이지 경험 유지
- 빠른 로딩 (별도 페이지 로드 불필요)
- 일관된 디자인 시스템
- 매끄러운 사용자 경험
- 모바일 친화적

## 주의사항
- JavaScript 비활성화 환경에서의 대안 필요
- 모달 콘텐츠가 긴 경우 스크롤 처리
- 브라우저 뒤로가기 버튼 동작 고려