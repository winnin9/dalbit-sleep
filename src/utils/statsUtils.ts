import type { SleepRecord, WeeklyStats, MonthlyStarData } from '../types'
import { getRecentDays, getMonthDays } from './dateUtils'

/**
 * 최근 7일 평균 별점 (기록 있는 날만 계산)
 */
export function getWeeklyAverage(records: SleepRecord[]): number {
  const last7 = getRecentDays(7)
  const recordMap = new Map(records.map(r => [r.date, r]))
  const recent = last7.filter(d => recordMap.has(d)).map(d => recordMap.get(d)!.stars)
  if (recent.length === 0) return 0
  return Math.round((recent.reduce((sum, s) => sum + s, 0) / recent.length) * 10) / 10
}

/**
 * 현재 연속 기록일 (오늘 포함, 연속 끊기면 중단)
 */
export function getStreakCount(records: SleepRecord[]): number {
  if (records.length === 0) return 0
  const dateSet = new Set(records.map(r => r.date))
  const today = getRecentDays(1)[0]
  let count = 0
  let current = today

  while (dateSet.has(current)) {
    count++
    const d = new Date(current + 'T00:00:00+09:00')
    d.setDate(d.getDate() - 1)
    current = d.toISOString().slice(0, 10)
  }
  return count
}

/**
 * 최장 연속 기록일 (역대)
 */
export function getLongestStreak(records: SleepRecord[]): number {
  if (records.length === 0) return 0
  const dates = [...new Set(records.map(r => r.date))].sort()
  let max = 1
  let current = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00+09:00')
    const curr = new Date(dates[i] + 'T00:00:00+09:00')
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      current++
      max = Math.max(max, current)
    } else {
      current = 1
    }
  }
  return max
}

/**
 * 이번 달 별점 데이터 (꺾은선 그래프용)
 */
export function getMonthlyStarData(
  records: SleepRecord[],
  year: number,
  month: number
): MonthlyStarData[] {
  const days = getMonthDays(year, month)
  const recordMap = new Map(records.map(r => [r.date, r]))
  return days.map(date => ({
    date,
    stars: recordMap.get(date)?.stars ?? null,
  }))
}

/**
 * 주간 통계 한 번에 계산
 */
export function getWeeklyStats(records: SleepRecord[]): WeeklyStats {
  return {
    averageStars: getWeeklyAverage(records),
    streakCount: getStreakCount(records),
    longestStreak: getLongestStreak(records),
  }
}
