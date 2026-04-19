import { useEffect, useState } from 'react'
import { Asset, Spacing } from '@toss/tds-mobile'
import { getMoonImageUrl } from '../utils/moonUtils'
import { TUTORIAL_MOON_PIECES, FULL_MOON_PIECES } from '../utils/moonUtils'

type Props = {
  targetPieces: number
  onClaim: () => void
  onSkip: () => void
}

export default function FullMoonPage({ targetPieces, onClaim, onSkip }: Props) {
  const [ready, setReady] = useState(false)
  const isTutorial = targetPieces === TUTORIAL_MOON_PIECES

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2500)
    return () => clearTimeout(t)
  }, [])

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
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 200, 66, 0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* 반짝이는 별 파티클 */}
      {ready && ['10%', '85%', '20%', '75%', '45%'].map((left, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${15 + i * 8}%`,
            left,
            fontSize: 14,
            animation: `twinkle ${1.2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          ✦
        </div>
      ))}

      {/* 보름달 이미지 */}
      <div style={{ animation: 'pulse 2.5s ease-in-out infinite' }}>
        <Asset.Image
          frameShape={Asset.frameShape.CleanW250}
          backgroundColor="transparent"
          src={getMoonImageUrl(15)}
          aria-hidden={true}
          style={{ aspectRatio: '1/1' }}
        />
      </div>

      <Spacing size={20} />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
        🎉 보름달 완성!
      </h1>

      <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
        {isTutorial
          ? `첫 달빛 ${TUTORIAL_MOON_PIECES}조각을 모았어요!\n토스 포인트로 교환해보세요.`
          : `달빛 ${FULL_MOON_PIECES}조각을 모두 모았어요.\n토스 포인트로 교환해보세요!`
        }
      </p>

      <Spacing size={40} />

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <button
          onClick={onClaim}
          style={{
            width: '100%',
            padding: '17px',
            background: 'linear-gradient(135deg, #F5C842 0%, #FFE066 50%, #F5A623 100%)',
            color: '#1A1A1A',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(245, 200, 66, 0.55)',
            letterSpacing: '-0.2px',
          }}
        >
          토스 포인트 받기
        </button>
        <button
          onClick={onSkip}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontSize: 14,
            borderRadius: 14,
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
        >
          나중에 받기
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
