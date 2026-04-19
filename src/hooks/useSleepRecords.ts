import { useStorage } from './useStorage'
import { getTodayKey } from '../utils/dateUtils'
import { getMoonPieces } from '../utils/moonUtils'
import type { SleepRecord } from '../types'

const STORAGE_KEY = 'dalbit_sleep_records'

export function useSleepRecords() {
  const [records, setRecords] = useStorage<SleepRecord[]>(STORAGE_KEY, [])

  /** 오늘 기록 추가 (중복 방지) */
  const addRecord = (stars: 1 | 2 | 3 | 4 | 5, memo?: string): SleepRecord => {
    const today = getTodayKey()
    const existing = records.find(r => r.date === today)
    if (existing) return existing

    const newRecord: SleepRecord = {
      date: today,
      stars,
      memo: memo?.slice(0, 100),
      moonPieces: getMoonPieces(stars),
      createdAt: Date.now(),
    }
    setRecords([...records, newRecord])
    return newRecord
  }

  /** 오늘 기록 반환 */
  const getTodayRecord = (): SleepRecord | undefined => {
    return records.find(r => r.date === getTodayKey())
  }

  /** 특정 날짜 기록 반환 */
  const getRecordByDate = (date: string): SleepRecord | undefined => {
    return records.find(r => r.date === date)
  }

  return { records, addRecord, getTodayRecord, getRecordByDate }
}
