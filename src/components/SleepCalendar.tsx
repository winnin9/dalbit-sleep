import { useState } from 'react'
import type { SleepRecord } from '../types'
import { getMonthDays, getDayOfWeek, getCurrentYearMonth, isToday } from '../utils/dateUtils'

type Props = {
  records: SleepRecord[]
}

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토']

function StarIcon({ stars, size = 18 }: { stars: number; size?: number }) {
  const color =
    stars >= 4
      ? 'var(--color-moon)'
      : stars === 3
        ? 'var(--color-text-secondary)'
        : 'var(--color-text-muted)'

  return (
    <span style={{ fontSize: size, color, lineHeight: 1 }}>
      {stars >= 4 ? '🌙' : stars === 3 ? '★' : '☆'}
    </span>
  )
}

export default function SleepCalendar({ records }: Props) {
  const current = getCurrentYearMonth()
  const [year, setYear] = useState(current.year)
  const [month, setMonth] = useState(current.month)

  const days = getMonthDays(year, month)
  const recordMap = new Map(records.map(r => [r.date, r]))

  // 첫 날의 요일 오프셋 (일=0)
  const firstDayOffset = getDayOfWeek(days[0])

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={prevMonth}
          style={{ color: 'var(--color-text-secondary)', fontSize: 20, padding: '4px 8px' }}
        >
          ‹
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
          {year}년 {month}월
        </span>
        <button
          onClick={nextMonth}
          style={{ color: 'var(--color-text-secondary)', fontSize: 20, padding: '4px 8px' }}
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {/* 오프셋 빈 칸 */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(dateStr => {
          const day = parseInt(dateStr.split('-')[2])
          const record = recordMap.get(dateStr)
          const today = isToday(dateStr)

          return (
            <div
              key={dateStr}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                background: today ? 'var(--color-bg-card)' : 'transparent',
                border: today ? '1px solid var(--color-primary)' : '1px solid transparent',
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: today ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                  fontWeight: today ? 700 : 400,
                  lineHeight: 1,
                }}
              >
                {day}
              </span>
              {record ? (
                <StarIcon stars={record.stars} size={12} />
              ) : (
                <div style={{ height: 12 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
