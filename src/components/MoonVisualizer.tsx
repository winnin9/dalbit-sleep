import { getMoonFillRatio, getMoonPhase, getMoonPhaseName, FULL_MOON_PIECES } from '../utils/moonUtils'

type Props = {
  pieces: number
  size?: number
  animate?: boolean
}

export default function MoonVisualizer({ pieces, size = 200, animate = true }: Props) {
  const ratio = getMoonFillRatio(pieces)
  const phase = getMoonPhase(pieces)
  const isFull = phase === 'full'

  // clip-path x 오프셋: 0% = 완전 가려짐(초승달), 100% = 완전 노출(보름달)
  // ratio 0 → clipX = size (전부 가림), ratio 1 → clipX = 0 (전부 노출)
  const clipX = size * (1 - ratio)

  const r = size / 2
  const cx = size / 2
  const cy = size / 2

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          filter: isFull
            ? `drop-shadow(0 0 ${size * 0.15}px rgba(245, 200, 66, 0.8)) drop-shadow(0 0 ${size * 0.3}px rgba(245, 200, 66, 0.4))`
            : `drop-shadow(0 0 ${size * 0.08}px rgba(245, 200, 66, 0.3))`,
          transition: animate ? 'filter 0.6s ease' : undefined,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* 달 채워지는 영역 clip */}
            <clipPath id="moon-fill-clip">
              <rect
                x={clipX}
                y={0}
                width={size}
                height={size}
                style={{
                  transition: animate ? 'x 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
                }}
              />
            </clipPath>
            {/* 달 테두리 clip */}
            <clipPath id="moon-circle-clip">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
            {/* 달 표면 텍스처 그라디언트 */}
            <radialGradient id="moon-surface" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="50%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#D4960A" />
            </radialGradient>
            {/* 어두운 달 배경 */}
            <radialGradient id="moon-dark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A2E45" />
              <stop offset="100%" stopColor="#0D1B2A" />
            </radialGradient>
          </defs>

          {/* 어두운 달 (배경) */}
          <circle cx={cx} cy={cy} r={r} fill="url(#moon-dark)" />

          {/* 달 테두리 (항상 표시) */}
          <circle
            cx={cx}
            cy={cy}
            r={r - 1}
            fill="none"
            stroke="rgba(245, 200, 66, 0.25)"
            strokeWidth={1.5}
          />

          {/* 채워진 달 영역 */}
          <g clipPath="url(#moon-fill-clip)">
            <circle cx={cx} cy={cy} r={r} fill="url(#moon-surface)" />
            {/* 달 표면 크레이터 */}
            <circle cx={cx * 0.75} cy={cy * 0.7} r={r * 0.06} fill="rgba(180, 120, 0, 0.3)" />
            <circle cx={cx * 1.2} cy={cy * 0.85} r={r * 0.04} fill="rgba(180, 120, 0, 0.25)" />
            <circle cx={cx * 0.9} cy={cy * 1.2} r={r * 0.05} fill="rgba(180, 120, 0, 0.2)" />
          </g>

          {/* 보름달 완성 시 글로우 오버레이 */}
          {isFull && (
            <circle
              cx={cx}
              cy={cy}
              r={r * 0.95}
              fill="rgba(255, 240, 150, 0.08)"
            />
          )}
        </svg>
      </div>

      {/* 달 이름 + 조각 수 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
          {getMoonPhaseName(phase)}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {pieces} / {FULL_MOON_PIECES} 조각
        </div>
      </div>
    </div>
  )
}
