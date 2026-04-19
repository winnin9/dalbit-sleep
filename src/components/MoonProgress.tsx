import { FULL_MOON_PIECES, TUTORIAL_MOON_PIECES } from '../utils/moonUtils'

type Props = {
  pieces: number
  targetPieces?: number // 기본값 FULL_MOON_PIECES
}

export default function MoonProgress({ pieces, targetPieces = FULL_MOON_PIECES }: Props) {
  const pct = Math.min((pieces / targetPieces) * 100, 100)
  const isTutorial = targetPieces === TUTORIAL_MOON_PIECES
  const remaining = targetPieces - pieces

  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'var(--color-bg-card)',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
      }}
    >
      {/* 상단: 조각 수 + 튜토리얼 뱃지 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            달빛 조각
          </span>
          {isTutorial && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--color-primary-light)',
                background: 'rgba(107, 78, 255, 0.15)',
                padding: '2px 7px',
                borderRadius: 20,
              }}
            >
              첫 보름달
            </span>
          )}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-moon)' }}>
          {pieces}
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: 13 }}>
            {' '}/ {targetPieces}
          </span>
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div
        style={{
          height: 8,
          background: 'var(--color-bg)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: isTutorial
              ? 'linear-gradient(90deg, #9B7EFF 0%, #F5C842 100%)'
              : 'linear-gradient(90deg, #6B4EFF 0%, #F5C842 100%)',
            borderRadius: 4,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* 하단: 남은 조각 수 또는 완성 */}
      {pieces < targetPieces && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: 'var(--color-text-muted)',
            textAlign: 'right',
          }}
        >
          보름달까지 {remaining}조각 남음
        </div>
      )}
      {pieces >= targetPieces && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-moon)',
            textAlign: 'center',
          }}
        >
          보름달 완성! 🌕
        </div>
      )}
    </div>
  )
}
