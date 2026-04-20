// 페이지 라우팅
export type Page =
  | 'onboarding'
  | 'main'
  | 'record'
  | 'record-complete'
  | 'fullmoon'
  | 'stats'
  | 'settings'

// 수면 기록
export type SleepRecord = {
  date: string // 'YYYY-MM-DD' (기상일 기준)
  stars: 1 | 2 | 3 | 4 | 5
  memo?: string // 최대 100자
  moonPieces: 1 // 기록 1회 = 달빛 조각 1개 균일 지급 (Option C)
  createdAt: number // timestamp
}

// 달 상태
export type MoonState = {
  currentPieces: number // 0~14
  totalCompleted: number // 누적 보름달 완성 횟수
  totalPoints: number // 누적 토스 포인트
  pendingReward: boolean // 보름달 완성 후 포인트 전환 대기 여부
  tutorialDone: boolean // 첫 번째 보름달(5조각) 완성 여부
}

// 앱 설정
export type AppSettings = {
  onboardingDone: boolean
  notificationEnabled: boolean
  notificationHour: number // 6~11
}

// 달 위상 (초승달→보름달 시각화용)
export type MoonPhase =
  | 'new' // 0조각
  | 'crescent' // 1~4조각
  | 'quarter' // 5~7조각
  | 'half' // 8~10조각
  | 'gibbous' // 11~13조각
  | 'full' // 14조각 이상

// 통계 데이터
export type WeeklyStats = {
  averageStars: number
  streakCount: number
  longestStreak: number
}

export type MonthlyStarData = {
  date: string
  stars: number | null
}
