import type { SleepRecord } from '../types'
import { getRecentDays, isToday } from '../utils/dateUtils'

type Props = {
  records: SleepRecord[]
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00')
  return DAY_NAMES[d.getDay()]
}

function StarDots({ stars }: { stars: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            fontSize: 10,
            color: i <= stars ? 'var(--color-star-active)' : 'var(--color-star-inactive)',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function WeekPreview({ records }: Props) {
  const days = getRecentDays(7).reverse() // 오래된 순 → 최신 순
  const recordMap = new Map(records.map(r => [r.date, r]))

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}
    >
      {days.map(date => {
        const record = recordMap.get(date)
        const today = isToday(date)

        return (
          <div
            key={date}
            style={{
              flexShrink: 0,
              width: 52,
              padding: '10px 6px',
              background: today ? 'var(--color-bg-card)' : 'var(--color-bg-surface)',
              borderRadius: 12,
              border: today
                ? '1px solid var(--color-primary)'
                : '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* 요일 */}
            <span
              style={{
                fontSize: 11,
                color: today ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                fontWeight: today ? 700 : 400,
              }}
            >
              {getDayName(date)}
            </span>

            {/* 달빛 조각 or 빈 원 */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: record
                  ? record.moonPieces > 0
                    ? 'var(--color-moon)'
                    : 'var(--color-bg)'
                  : 'transparent',
                border: record
                  ? record.moonPieces > 0
                    ? 'none'
                    : '1px solid var(--color-border)'
                  : '1px dashed var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              {record ? (record.moonPieces > 0 ? '🌙' : '—') : ''}
            </div>

            {/* 별점 */}
            {record ? (
              <StarDots stars={record.stars} />
            ) : (
              <div style={{ height: 14 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
