// 한국 시간(KST) 기준 날짜 처리

/**
 * 한국 시간 기준 오늘 날짜를 'YYYY-MM-DD' 형식으로 반환
 */
export function getTodayKey(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

/**
 * 주어진 날짜 문자열이 오늘인지 확인
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayKey()
}

/**
 * 최근 N일의 날짜 배열 반환 (오늘 포함, 최신순)
 */
export function getRecentDays(n: number): string[] {
  const days: string[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
    days.push(kst.toISOString().slice(0, 10))
  }
  return days
}

/**
 * 특정 월의 모든 날짜 배열 반환
 */
export function getMonthDays(year: number, month: number): string[] {
  const days: string[] = []
  const daysInMonth = new Date(year, month, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    days.push(`${year}-${mm}-${dd}`)
  }
  return days
}

/**
 * 이번 달의 year, month 반환
 */
export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return { year: kst.getFullYear(), month: kst.getMonth() + 1 }
}

/**
 * 날짜 문자열을 'M월 D일' 형식으로 포맷
 */
export function formatDateKo(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}월 ${parseInt(d)}일`
}

/**
 * 요일 반환 (0=일, 1=월, ..., 6=토)
 */
export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00+09:00').getDay()
}
