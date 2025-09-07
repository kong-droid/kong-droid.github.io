# 기술 스택 및 기여 부분 업데이트 계획

## 1. AWS 기술 스택 확장

### 현재 상태
- Cloud & Infrastructure 섹션에 AWS EC2, S3, RDS, IoT Core가 있음
- 각각 개별 항목으로 관리되고 있음

### 제안사항
AWS 서비스들을 통합하여 "AWS ETC" 항목 추가:
- **기존**: AWS EC2 (3년+), AWS S3 (3년+), AWS RDS (3년+), AWS IoT Core (1년+)
- **추가**: AWS ETC (CloudFront, CloudWatch, IAM 등) (3년+)

### 최종 구조
```
Cloud & Infrastructure:
- AWS EC2 (3년+) - 85%
- AWS S3 (3년+) - 80% 
- AWS RDS (3년+) - 80%
- AWS IoT Core (1년+) - 70%
- AWS ETC (3년+) - 75% [새로 추가]
- Linux (5년+) - 75%
```

## 2. Key Achievement Stats 확장

### 현재 성과 항목들
1. RDS 비용 절감 (50%)
2. 조회 속도 개선 (3초→0.5초)
3. 재사용성 향상 (70%)
4. IoT 기기 판매 (1000대+)

### 추가할 성과 항목들

#### 추가 항목 1: CI/CD 개선
- **내용**: "젠킨슨에서 깃헙 액션으로 바꾸면서 프로그래밍의 유지보수 지원 관련된 부분의 가능성을 높였다"
- **간소화**: "CI/CD 전환으로 유지보수성 향상"
- **아이콘**: `<i class="fas fa-cogs"></i>`
- **수치**: "유지보수성 향상" 또는 "30%" (향상 정도)

#### 추가 항목 2: 인프라 구축
- **내용**: "aws 서비스를 활용해 모바일 서버, mqtt 서버, 파일 서버 등 인프라 구축"
- **간소화**: "다중 서버 인프라 구축"
- **아이콘**: `<i class="fas fa-server"></i>`
- **수치**: "3종" (서버 종류 수) 또는 "인프라 구축"

### 최종 성과 섹션 (6개 항목)
```
1. RDS 비용 절감 (50%)
2. 조회 속도 개선 (3초→0.5초)  
3. 재사용성 향상 (70%)
4. IoT 기기 판매 (1000대+)
5. CI/CD 전환 효과 (유지보수성)     [새로 추가]
6. 다중 서버 구축 (3종 인프라)    [새로 추가]
```

## 3. HTML 구조 변경사항

### AWS ETC 항목 추가
```html
<div class="skill-item advanced">
  <span class="skill-name">AWS ETC</span>
  <div class="skill-level">
    <div class="skill-bar" data-level="75"></div>
  </div>
  <span class="skill-years">3년+</span>
</div>
```

### Achievement Stats 항목 추가
```html
<!-- 추가 항목 1 -->
<div class="stat-item">
  <div class="stat-icon">
    <i class="fas fa-cogs"></i>
  </div>
  <div class="stat-content">
    <span class="stat-number">CI/CD 전환</span>
    <span class="stat-label">유지보수성 향상</span>
  </div>
</div>

<!-- 추가 항목 2 -->
<div class="stat-item">
  <div class="stat-icon">
    <i class="fas fa-server"></i>
  </div>
  <div class="stat-content">
    <span class="stat-number">모바일, 파일, IoT 서버</span>
    <span class="stat-label">스마트팟 서버 구축</span>
  </div>
</div>
```

## 4. 배치 및 레이아웃 고려사항

현재 4개의 achievement stats가 한 줄에 배치되어 있는데, 6개로 늘어날 경우:
- 모바일에서는 2x3 그리드로 배치
- 데스크톱에서는 3x2 또는 6개 한 줄로 배치 가능
- CSS 조정이 필요할 수 있음

## 검토 포인트

1. **AWS ETC 설명**: CloudFront, CloudWatch, IAM을 명시적으로 표시할지, 아니면 ETC로만 표시할지
2. **성과 수치**: "유지보수성"과 "3종"이 다른 항목들과 일관성 있게 느껴지는지
3. **아이콘 선택**: 각 항목에 적합한 FontAwesome 아이콘 확인
4. **레이아웃**: 6개 항목의 반응형 배치 방식

이 계획에 대해 검토 후 수정사항이 있으면 알려주세요.