import type { SleepRecord, MoonState } from '../types'
import SleepCalendar from '../components/SleepCalendar'
import { getWeeklyStats, getMonthlyStarData } from '../utils/statsUtils'
import { getCurrentYearMonth } from '../utils/dateUtils'

type Props = {
  records: SleepRecord[]
  moonState: MoonState
  onBack: () => void
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string | number
  sub?: string
  icon: string
}) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--color-bg-card)',
        borderRadius: 16,
        padding: '16px',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-moon)' }}>{value}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</span>
      {sub && (
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</span>
      )}
    </div>
  )
}

function StarChart({ records }: { records: SleepRecord[] }) {
  const { year, month } = getCurrentYearMonth()
  const data = getMonthlyStarData(records, year, month).filter(d => d.stars !== null)

  if (data.length < 2) {
    return (
      <div
        style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 13,
        }}
      >
        기록이 2개 이상 있어야 그래프가 표시돼요
      </div>
    )
  }

  const svgH = 80
  const svgW = 280
  const pad = 16

  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (svgW - pad * 2))
  const ys = data.map(d => svgH - pad - ((d.stars! - 1) / 4) * (svgH - pad * 2))

  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
      {/* Y축 그리드 */}
      {[1, 2, 3, 4, 5].map(s => {
        const y = svgH - pad - ((s - 1) / 4) * (svgH - pad * 2)
        return (
          <line
            key={s}
            x1={pad}
            y1={y}
            x2={svgW - pad}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        )
      })}
      {/* 라인 */}
      <path d={pathD} fill="none" stroke="var(--color-primary-light)" strokeWidth={2} />
      {/* 점 */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={3} fill="var(--color-moon)" />
      ))}
    </svg>
  )
}

export default function StatsPage({ records, moonState, onBack }: Props) {
  const stats = getWeeklyStats(records)

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
        <button
          onClick={onBack}
          style={{ fontSize: 22, color: 'var(--color-text-secondary)', padding: '4px 8px 4px 0' }}
        >
          ‹
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>수면 통계</h1>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 20px 40px', overflow: 'auto' }}>
        {/* 요약 카드 행 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <StatCard
            icon="⭐"
            label="주간 평균 별점"
            value={stats.averageStars > 0 ? `${stats.averageStars}점` : '-'}
          />
          <StatCard
            icon="🔥"
            label="현재 연속"
            value={stats.streakCount > 0 ? `${stats.streakCount}일` : '-'}
            sub={stats.longestStreak > 0 ? `최장 ${stats.longestStreak}일` : undefined}
          />
          <StatCard
            icon="🌕"
            label="보름달 완성"
            value={`${moonState.totalCompleted}회`}
          />
        </div>

        {/* 이번 달 별점 추이 */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 16,
            padding: '16px 16px 12px',
            border: '1px solid var(--color-border)',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
            이번 달 별점 추이
          </div>
          <StarChart records={records} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>월초</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>월말</span>
          </div>
        </div>

        {/* 달력 */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 16,
            padding: '16px',
            border: '1px solid var(--color-border)',
          }}
        >
          <SleepCalendar records={records} />
        </div>
      </div>
    </div>
  )
}
