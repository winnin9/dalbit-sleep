# 달빛수면 구현 플랜 v1.0

> PRD v1.0 기반 앱인토스 미니앱 구현 계획

**작성일**: 2026-04-17  
**플랫폼**: 앱인토스 (Toss 미니앱)  
**기술 스택**: Vite + React + TypeScript + TDS Mobile

---

## 파일 구조

```
dalbit-sleep/
  granite.config.ts
  vite.config.ts
  src/
    types/
      index.ts              # SleepRecord, MoonState, AppSettings 타입
    utils/
      moonUtils.ts          # 달빛 조각 계산, 달 차오름 로직
      dateUtils.ts          # 날짜 처리 (자정 기준, 한국 타임존)
      statsUtils.ts         # 통계 계산 로직
    hooks/
      useStorage.ts         # Toss Storage API 래퍼
      useSleepRecords.ts    # 수면 기록 CRUD
      useMoonState.ts       # 달빛 조각 & 보름달 상태
      useSettings.ts        # 앱 설정 (알림 시간 등)
    components/
      MoonVisualizer.tsx    # 달 차오름 SVG 애니메이션
      StarRating.tsx        # 별점 입력 컴포넌트
      MoonProgress.tsx      # 진행 바 (X/15 조각)
      SleepCalendar.tsx     # 월간 캘린더 뷰
      WeekPreview.tsx       # 최근 7일 미리보기
    pages/
      OnboardingPage.tsx    # 온보딩 (3~4장 슬라이드)
      MainPage.tsx          # 메인 (달 + 달력)
      RecordPage.tsx        # 수면 기록 입력
      RecordCompletePage.tsx # 기록 완료 + 조각 적립 애니메이션
      FullMoonPage.tsx      # 보름달 완성 + 광고 연결
      StatsPage.tsx         # 수면 통계
      SettingsPage.tsx      # 알림 설정
    App.tsx                 # 상태 기반 라우팅
    main.tsx
    index.css
```

---

## Task 1: 프로젝트 초기 세팅

- [ ] Vite React+TypeScript 프로젝트 생성
- [ ] 앱인토스 필수 패키지 설치
  ```bash
  npm install @apps-in-toss/web-framework
  npm install @toss/tds-mobile @toss/tds-mobile-ait @toss/tds-colors
  npm install @emotion/react
  ```
- [ ] `granite.config.ts` 작성 (appName: `dalbit-sleep`)
- [ ] `vite.config.ts` 설정
- [ ] `src/index.css` 기본 스타일 (폰트, 색상 변수, 다크 배경)
- [ ] `App.tsx` 라우팅 골격 작성 (페이지 상태 관리)

---

## Task 2: 타입 정의 (`src/types/index.ts`)

- [ ] `SleepRecord` 타입
  ```typescript
  type SleepRecord = {
    date: string;        // 'YYYY-MM-DD'
    stars: 1 | 2 | 3 | 4 | 5;
    memo?: string;       // 최대 100자
    moonPieces: 0 | 1 | 2; // 별점에 따른 조각 수
  }
  ```
- [ ] `MoonState` 타입
  ```typescript
  type MoonState = {
    currentPieces: number;   // 0~14
    totalCompleted: number;  // 누적 보름달 완성 횟수
    totalPoints: number;     // 누적 포인트
    pendingReward: boolean;  // 광고 시청 대기 여부
  }
  ```
- [ ] `AppSettings` 타입
  ```typescript
  type AppSettings = {
    onboardingDone: boolean;
    notificationEnabled: boolean;
    notificationHour: number; // 6~11
  }
  ```
- [ ] `Page` 타입 (라우팅용 유니온)

---

## Task 3: 유틸 함수

### `src/utils/dateUtils.ts`
- [ ] `getTodayKey()` — 한국 시간 기준 'YYYY-MM-DD' 반환
- [ ] `isToday(dateStr)` — 오늘 날짜 여부 확인
- [ ] `getLast7Days()` — 최근 7일 날짜 배열 반환
- [ ] `getMonthDays(year, month)` — 특정 월의 모든 날짜 반환

### `src/utils/moonUtils.ts`
- [ ] `getMoonPieces(stars)` — 별점 → 달빛 조각 수 계산 (5점→2, 4점→1, 1~3점→0)
- [ ] `getMoonPhase(pieces)` — 조각 수 → 달 위상 (0~1 비율, 0=초승달, 1=보름달)
- [ ] `isFullMoon(pieces)` — 15조각 달성 여부

### `src/utils/statsUtils.ts`
- [ ] `getWeeklyAverage(records)` — 최근 7일 평균 별점
- [ ] `getStreakCount(records)` — 현재 연속 기록일
- [ ] `getLongestStreak(records)` — 최장 연속 기록일
- [ ] `getMonthlyStarData(records, year, month)` — 꺾은선 그래프용 데이터

---

## Task 4: 훅

### `src/hooks/useStorage.ts`
- [ ] 개발: `localStorage` 기반 제네릭 훅
- [ ] 앱인토스 배포 시 `@apps-in-toss/web-bridge`의 `storage` API로 교체 준비 (인터페이스 동일하게)

### `src/hooks/useSleepRecords.ts`
- [ ] `records` 상태 (전체 기록 배열)
- [ ] `addRecord(stars, memo?)` — 오늘 기록 추가 (중복 방지)
- [ ] `getTodayRecord()` — 오늘 기록 반환
- [ ] `getRecordByDate(date)` — 특정 날짜 기록

### `src/hooks/useMoonState.ts`
- [ ] `moonState` 상태
- [ ] `addPieces(count)` — 조각 추가 + 보름달 달성 감지
- [ ] `completeFullMoon()` — 보름달 완성 처리 (초기화 + 완성 횟수 증가)
- [ ] `claimReward()` — 광고 시청 후 포인트 지급

### `src/hooks/useSettings.ts`
- [ ] `settings` 상태
- [ ] `completeOnboarding()` — 온보딩 완료 처리
- [ ] `updateNotificationTime(hour)` — 알림 시간 변경

---

## Task 5: 컴포넌트

### `MoonVisualizer.tsx`
- [ ] SVG 기반 달 렌더링 (조각 수에 따라 달빛 영역 clip-path로 표현)
- [ ] 조각 증가 시 달 차오름 CSS 애니메이션
- [ ] 보름달 완성 시 달빛 퍼짐 이펙트 (glow + pulse)
- [ ] 달 배경: 짙은 네이비/보랏빛 하늘 그라디언트

### `StarRating.tsx`
- [ ] 별 5개 탭 인터랙션 (터치 친화적, 48px 이상 타겟)
- [ ] 선택 별점 하이라이트 (노란 별 ★)
- [ ] 별점별 레이블 표시 ("매우 잘 잠 / 잘 잠 / 보통 / 못 잠 / 매우 못 잠")

### `MoonProgress.tsx`
- [ ] "X / 15 달빛 조각" 진행 바
- [ ] 애니메이션 프로그레스 바

### `SleepCalendar.tsx`
- [ ] 월간 7×5 그리드 캘린더
- [ ] 날짜별 별점 아이콘 렌더링
  - 4~5점: 달빛 조각 아이콘 (밝은 노랑)
  - 1~3점: 흐린 별 (회색)
  - 미기록: 빈 원
- [ ] 이전/다음 달 이동 버튼

### `WeekPreview.tsx`
- [ ] 최근 7일 가로 스크롤 카드
- [ ] 각 카드: 날짜 + 별점 아이콘

---

## Task 6: 페이지

### `OnboardingPage.tsx`
- [ ] 슬라이드 1: 앱 컨셉 소개 ("잘 잔 날 달빛을 모아요") + 달 일러스트
- [ ] 슬라이드 2: 기록 방법 소개 (별점 1~5점 설명)
- [ ] 슬라이드 3: 알림 시간 설정 (6~11시 슬라이더)
- [ ] 슬라이드 4: 첫 기록 유도 CTA
- [ ] 페이지 인디케이터 (점 3~4개)

### `MainPage.tsx`
- [ ] 상단: `MoonVisualizer` (조각 수 기반 달 렌더링)
- [ ] 중단: `MoonProgress` (X/15 진행 바)
- [ ] 하단: `WeekPreview` (최근 7일)
- [ ] 플로팅 버튼: "오늘 기록하기" (당일 미기록 시만 노출)
- [ ] 탭 네비게이션: 메인 / 달력 / 통계 / 설정

### `RecordPage.tsx`
- [ ] 헤더: "오늘 수면 기록" + 날짜
- [ ] `StarRating` 컴포넌트
- [ ] 메모 텍스트에어리어 (선택, 100자 제한, 글자 수 카운터)
- [ ] [기록하기] 버튼 (별점 선택 전 비활성화)

### `RecordCompletePage.tsx`
- [ ] 달빛 조각 적립 애니메이션 (4~5점 시)
  - 별 → 달빛 조각으로 변환되는 파티클 애니메이션
- [ ] 1~3점 시: 공감 메시지 + "오늘도 기록했어요" 격려
- [ ] 현재 달 조각 수 업데이트 표시
- [ ] [메인으로] 버튼

### `FullMoonPage.tsx`
- [ ] 보름달 완성 축하 애니메이션 (3~5초 자동)
  - 달빛 퍼짐 + 별 쏟아지는 이펙트
- [ ] "보름달을 완성했어요!" 카피
- [ ] [광고 보고 포인트 받기] 버튼
- [ ] [다음에 받기] 버튼 (광고 미시청 시 보름달만 완성)

### `StatsPage.tsx`
- [ ] 주간 평균 별점 카드
- [ ] 연속 기록일 / 최장 연속 기록 카드
- [ ] 누적 보름달 완성 횟수 카드
- [ ] 월간 별점 추이 꺾은선 그래프 (간단한 SVG)
- [ ] `SleepCalendar` (전체 기록 뷰)

### `SettingsPage.tsx`
- [ ] 알림 ON/OFF 토글
- [ ] 알림 시간 선택 (6~11시)
- [ ] 앱 버전 표시

---

## Task 7: 앱인토스 SDK 연동

- [ ] **Toss Storage API** 연동 (`useStorage.ts` 교체)
  ```typescript
  import { storage } from '@apps-in-toss/web-bridge'
  ```
- [ ] **보상형 광고** 연동 (`FullMoonPage.tsx`)
  ```typescript
  import { ad } from '@apps-in-toss/web-bridge'
  await ad.loadRewardedAd({ adUnitId: 'ait-ad-test-rewarded-id' })
  const result = await ad.showRewardedAd()
  ```
- [ ] **토스 로그인** 연동 — 포인트 전환 시 호출
  ```typescript
  import { appLogin } from '@apps-in-toss/web-bridge'
  // FullMoonPage에서 [광고 보고 포인트 받기] 버튼 탭 시 호출
  const { authorizationCode } = await appLogin()
  ```
  > 로그인은 포인트 전환 시점에만 요구 (앱 진입 시 불필요)
- [ ] **프로모션(토스 포인트 지급)** 연동 (`FullMoonPage.tsx`)
  ```typescript
  import { grantPromotionReward } from '@apps-in-toss/web-framework'

  // 광고 시청 완료 후 호출
  const result = await grantPromotionReward({
    params: {
      promotionCode: 'TEST_달빛수면_보름달',  // 테스트: TEST_ 접두사, 실제: 콘솔 발급 코드
      amount: 100,  // 지급 포인트 (콘솔에서 확정)
    },
  })

  if (!result) { /* 앱 버전 미지원 안내 */ }
  else if (result === 'ERROR') { /* 오류 처리 */ }
  else if ('key' in result) { /* 지급 성공 */ }
  else if ('errorCode' in result) {
    // 4109: 예산 소진 | 4110: 중복 지급 | 4112: 예산 부족
  }
  ```
  > **중복 방지**: `grantPromotionReward`는 동일 유저 중복 호출 시 4110 에러 반환  
  > **명칭 규칙**: UI에서 "포인트" 단독 사용 금지 → "토스 포인트"로 표기  
  > **앱 버전**: 토스앱 v5.232.0 이상 필요
- [ ] **프로모션 콘솔 설정** (코딩 전 선행)
  - 앱인토스 콘솔 → 프로모션 → 새 프로모션 생성
  - 비즈 월렛 예산 충전
  - 종료일, 1인 1회 제한 설정
  - 검수 신청 (출시 전 영업일 2~3일 소요)
- [ ] `granite.config.ts` 최종 설정
  - 앱인토스 콘솔에서 아이콘 URL 획득 후 입력
  - 브랜드 컬러: `#4A90D9` (달빛 파랑) 또는 `#6B4EFF` (달빛 보라) — 디자인 확정 후 결정

---

## Task 8: 앱 등록 에셋 제작

- [ ] `public/assets/logo-600.html` 작성 (600×600 PNG용)
  - 배경: 짙은 네이비 그라디언트
  - 중앙: 보름달 일러스트
  - 하단: "달빛수면" 텍스트
- [ ] `public/assets/thumbnail-1932.html` 작성 (1932×828 PNG용)
- [ ] `take-screenshots.mjs` 작성 (Puppeteer 자동 캡처)
- [ ] 앱인토스 콘솔 앱 등록 (appName: `dalbit-sleep`)
- [ ] 스토어 설명 텍스트 작성
  - 한 줄: "잘 잔 날 달빛을 모으며 수면 습관을 만들어요"
  - 상세: 주요 기능 3~4가지 + 사용 시나리오

---

## Task 9: 빌드 & 테스트

- [ ] `npm run build` — dist/ 및 .ait 파일 생성
- [ ] `npx granite dev` — 로컬 WebView 환경 테스트
- [ ] 앱인토스 콘솔에 .ait 업로드
- [ ] QR 코드 생성 → 실기기 테스트
- [ ] 엣지 케이스 검증
  - [ ] 자정 기준 날짜 전환 테스트
  - [ ] 보름달 완성 후 광고 미시청 → 다음 접속 시 상태 유지
  - [ ] 앱 재시작 후 데이터 복원 (Toss Storage)
  - [ ] 14조각 → 5점 기록 → 보름달 달성 플로우

---

## 런칭 체크리스트

### 🔴 런칭 필수
- [ ] Toss Storage API 연동 완료
- [ ] 보상형 광고 SDK 연동 완료
- [ ] granite.config.ts 완성 (icon URL 포함)
- [ ] 실기기 QR 테스트 완료

### 🟡 오픈 전 권장
- [ ] 달 차오름 애니메이션 실기기 확인
- [ ] 보름달 완성 이펙트 실기기 확인
- [ ] 40~50대 타겟 고려한 폰트 크기 확인 (최소 16px)
- [ ] 온보딩 흐름 전체 테스트

### 🟢 오픈 후 (MVP 후속)
- [ ] 포인트 사용처 결정 (v2.0)
- [ ] 보름달 완성 후 광고 미시청 재시도 정책 결정
- [ ] 수면 트래커 연동 검토 (v2.0)

---

## 디자인 방향

| 항목 | 내용 |
|------|------|
| 배경 | 짙은 네이비 (#0D1B2A) — 밤하늘 느낌 |
| 주 컬러 | 달빛 파랑-보라 그라디언트 |
| 달 시각화 | SVG clip-path 기반, 초승달→보름달 |
| 폰트 크기 | 최소 16px (40~50대 타겟 가독성) |
| 인터랙션 | 별점 탭 영역 48px 이상 (터치 친화) |
| 애니메이션 | CSS transitions 중심 (성능 우선) |

---

*이 플랜은 달빛수면 v1.0 구현 진행 상황 추적에 활용합니다.*
