import { useEffect, useState } from 'react'
import type { SleepRecord, MoonState } from '../types'
import MoonProgress from '../components/MoonProgress'
import { getStarMessage } from '../utils/moonUtils'

type Props = {
  record: SleepRecord
  moonState: MoonState
  targetPieces: number
  onDone: () => void
}

export default function RecordCompletePage({ record, moonState, targetPieces, onDone }: Props) {
  const [showPieces, setShowPieces] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowPieces(true), 400)
    const t2 = setTimeout(() => setShowProgress(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const isGoodSleep = record.stars >= 4 // 2조각 (잘 잠)
  const pieceCount = record.moonPieces   // 항상 1 또는 2

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '40px 24px',
        gap: 28,
        textAlign: 'center',
      }}
    >
      {/* 이모지 아이콘 */}
      <div
        style={{
          fontSize: 80,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: showPieces ? 'scale(1)' : 'scale(0.5)',
          opacity: showPieces ? 1 : 0,
        }}
      >
        {isGoodSleep ? '🌕' : '🌙'}
      </div>

      {/* 별점 + 메시지 */}
      <div>
        <div style={{ fontSize: 28, marginBottom: 12 }}>
          {'★'.repeat(record.stars)}{'☆'.repeat(5 - record.stars)}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          달빛 조각 +{pieceCount}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {getStarMessage(record.stars)}
        </p>
      </div>

      {/* 달빛 조각 뱃지 — 항상 표시 */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          opacity: showPieces ? 1 : 0,
          transform: showPieces ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.4s, transform 0.4s',
        }}
      >
        {Array.from({ length: pieceCount }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: isGoodSleep
                ? 'radial-gradient(circle, #FFE066 30%, #F5C842 100%)'
                : 'radial-gradient(circle, #9B7EFF 30%, #6B4EFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              boxShadow: isGoodSleep
                ? '0 0 18px rgba(245, 200, 66, 0.65)'
                : '0 0 18px rgba(107, 78, 255, 0.5)',
            }}
          >
            🌙
          </div>
        ))}
      </div>

      {/* 현재 진행도 */}
      <div
        style={{
          width: '100%',
          opacity: showProgress ? 1 : 0,
          transform: showProgress ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s, transform 0.4s',
        }}
      >
        <MoonProgress pieces={moonState.currentPieces} targetPieces={targetPieces} />
      </div>

      {/* 메인으로 버튼 */}
      <button
        onClick={onDone}
        style={{
          width: '100%',
          padding: '16px',
          background: 'var(--color-primary)',
          color: 'white',
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 14,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(107, 78, 255, 0.4)',
        }}
      >
        메인으로
      </button>
    </div>
  )
}
