import { useState, useEffect } from 'react'
import { Storage } from '@apps-in-toss/web-bridge'

/**
 * Toss Storage API 기반 스토리지 훅
 * - 초기 렌더링: localStorage에서 즉시 로드 (깜빡임 방지)
 * - 마운트 후: Toss Storage에서 최신 값으로 동기화
 * - set 호출 시: localStorage 즉시 저장 + Toss Storage 비동기 저장
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    Storage.getItem(key)
      .then(raw => {
        if (raw != null) {
          try {
            const parsed = JSON.parse(raw) as T
            setValue(parsed)
            localStorage.setItem(key, raw)
          } catch {
            // 파싱 실패 시 기존 값 유지
          }
        }
      })
      .catch(() => {
        // 로컬 개발 환경 등 Toss Storage 미지원 시 localStorage 유지
      })
  // key 변경 시에만 재실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const set = (newValue: T) => {
    setValue(newValue)
    const serialized = JSON.stringify(newValue)
    try {
      localStorage.setItem(key, serialized)
    } catch {}
    Storage.setItem(key, serialized).catch(() => {})
  }

  return [value, set] as const
}
