# Timeline 섹션 개선 방안

## 변경 내용
기존 HTML 내용은 그대로 유지하고 디자인만 수직 타임라인에서 수평 슬라이드 카루셀로 변경.
좌우 네비게이션 화살표와 도트 인디케이터 추가하여 현업자들이 빠르게 훑어볼 수 있도록 개선.
모바일, 태블릿, 웹 모든 디바이스에서 반응형으로 작동하도록 구현.

## 영향도 분석

### CSS 파일 수정 필요
- **main.css (681-868라인)**: timeline 관련 모든 스타일 재작성 필요
  - 기존 수직 레이아웃(.timeline::before, .timeline-item) → 수평 카루셀 구조로 변경
  - 반응형 브레이크포인트(1317, 1458라인) 모두 재구성
  - hover 효과, 애니메이션 전면 수정

### JavaScript 파일 수정 필요
- **main.js**: animateTimelineItem 함수(154-165라인) 카루셀용으로 재작성
- **component-loader.js**: timeline 관련 애니메이션 스타일 업데이트
- 새로운 카루셀 네비게이션 로직 추가 (좌우 버튼, 도트 인디케이터, 터치 제스처)

### 호환성 영향
- 기존 timeline-item, timeline-marker, timeline-content 클래스명 유지로 HTML 변경 없음
- Intersection Observer 기반 애니메이션 시스템과 연동 필요
- 스크롤 트리거 애니메이션을 카루셀 슬라이드 전환 애니메이션으로 변경