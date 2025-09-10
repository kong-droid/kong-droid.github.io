# Slider Dot 태블릿 환경 크기 문제 분석 보고서

## 🎯 문제 현상
- **발생 위치**: `views/ezpmp/dikidiki.html`의 `.slider-dots` 내 `.dot` 클래스
- **발생 조건**: 태블릿 환경(1017px 포함, 768px-1024px 구간)에서 dot가 타원형으로 거대해짐
- **사용자 신고**: "웹의 dot 크기를 유지하지 못하고 타원형으로 거대해진다"

## 🔍 근본 원인 분석

### CSS 미디어쿼리 구조 분석
```css
/* 1. 웹 기본 (1025px+) */
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

/* 2. 태블릿 (768px-1024px) - ❌ .dot 스타일 누락! */
@media (min-width: 768px) and (max-width: 1024px) {
  /* .dot 관련 스타일이 없음 */
  /* 웹용 10px × 10px가 그대로 적용됨 */
}

/* 3. 모바일 (768px 이하) */
@media (max-width: 768px) {
  .dot {
    width: 8px !important;
    height: 8px !important;
    border-width: 1px !important;
    border-radius: 50% !important;
  }
}

/* 4. 초소형 모바일 (320px 이하) */
@media (max-width: 320px) {
  .dot {
    width: 6px !important;
    height: 6px !important;
    border-width: 1px !important;
    border-radius: 50% !important;
  }
}
```

### 문제 발생 메커니즘
1. **1017px**는 태블릿 구간(768px-1024px)에 포함
2. 해당 구간에는 `.dot` 스타일 정의가 **완전 누락**
3. 결과적으로 **웹용 기본 스타일(10px × 10px)**이 그대로 적용
4. 태블릿 화면에서는 10px가 상대적으로 크게 보여 "거대해진다"고 인식

## 📊 현재 반응형 구간별 dot 크기

| 화면 크기 구간 | 범위 | dot 크기 | 상태 |
|---------------|------|----------|------|
| **데스크톱** | 1025px+ | 10px × 10px | ✅ 정상 |
| **태블릿** | 768-1024px | **10px × 10px** | ❌ **누락으로 웹 크기 유지** |
| **모바일** | 768px 이하 | 8px × 8px | ✅ 축소 정상 |
| **초소형** | 320px 이하 | 6px × 6px | ✅ 더욱 축소 |

## 💡 해결 방안

### 방안 1: 태블릿 구간에 적정 크기 dot 추가 (권장)
```css
/* Tablet (768px to 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 기존 코드... */
  
  /* 태블릿 전용 dot 스타일 추가 */
  .dot {
    width: 9px !important;
    height: 9px !important;
    border-width: 1.5px !important;
    border-radius: 50% !important;
  }
  
  .dot:hover {
    transform: scale(1.1) !important;
  }
  
  .dot.active {
    transform: scale(1.2) !important;
  }
  
  .dot.active::after {
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-width: 1.5px;
  }
  
  .slider-dots {
    gap: var(--spacing-xs);
    padding: var(--spacing-md) 0 0;
  }
}
```

### 방안 2: 세밀한 태블릿 구간 분할
```css
/* 대형 태블릿 (900px-1024px) */
@media (min-width: 900px) and (max-width: 1024px) {
  .dot {
    width: 9.5px !important;
    height: 9.5px !important;
  }
}

/* 소형 태블릿 (768px-899px) */
@media (min-width: 768px) and (max-width: 899px) {
  .dot {
    width: 8.5px !important;
    height: 8.5px !important;
  }
}
```

## 🎯 개선 후 예상 결과

### 개선된 반응형 구간별 dot 크기
| 화면 크기 구간 | 범위 | dot 크기 | 상태 |
|---------------|------|----------|------|
| **데스크톱** | 1025px+ | 10px × 10px | ✅ 유지 |
| **태블릿** | 768-1024px | **9px × 9px** | ✅ **적정 크기 적용** |
| **모바일** | 768px 이하 | 8px × 8px | ✅ 유지 |
| **초소형** | 320px 이하 | 6px × 6px | ✅ 유지 |

## 🔧 구현 우선순위

### 1순위: 태블릿 구간 dot 스타일 추가 (필수)
- 가장 중요하고 즉시 해결 가능
- 1017px 문제 직접 해결

### 2순위: 전체 dot 스타일 일관성 점검 (권장)
- 모든 미디어쿼리 구간의 dot 스타일 일관성 확보
- 호버/액티브 상태 애니메이션 통일

### 3순위: 추가 최적화 (선택)
- 더욱 세밀한 화면 크기별 조정
- 터치 디바이스 전용 최적화

## 📋 테스트 체크리스트

### 태블릿 테스트 (768px-1024px)
- [ ] 1017px에서 dot 크기 적정한지 확인
- [ ] 900px에서 dot 크기 적정한지 확인  
- [ ] 800px에서 dot 크기 적정한지 확인
- [ ] dot 호버 효과 정상 작동 확인
- [ ] dot active 상태 정상 표시 확인

### 경계값 테스트
- [ ] 1024px → 1025px 전환시 자연스러운지 확인
- [ ] 768px → 767px 전환시 자연스러운지 확인

## 🎉 결론

**태블릿 구간(768px-1024px)에 `.dot` 스타일이 누락**되어 웹용 10px 크기가 그대로 적용되는 것이 문제의 핵심입니다. 

해당 구간에 9px × 9px 크기의 적절한 dot 스타일을 추가하면 **모든 디바이스에서 균형잡힌 dot 표시**가 가능해집니다.

---

**작성일**: 2025-09-10  
**분석 대상**: `/views/ezpmp/dikidiki.html` slider dots  
**문제 구간**: 768px-1024px (태블릿)  
**해결 방법**: 태블릿 전용 `.dot` 스타일 추가