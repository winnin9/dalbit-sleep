import { useState } from 'react'
import StarRating from '../components/StarRating'
import { getTodayKey, formatDateKo } from '../utils/dateUtils'

type Props = {
  onSubmit: (stars: 1 | 2 | 3 | 4 | 5, memo?: string) => void
  onBack: () => void
}

export default function RecordPage({ onSubmit, onBack }: Props) {
  const [stars, setStars] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [memo, setMemo] = useState('')

  const today = getTodayKey()

  const handleSubmit = () => {
    if (!stars) return
    onSubmit(stars, memo.trim() || undefined)
  }

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontSize: 22,
            color: 'var(--color-text-secondary)',
            padding: '4px 8px 4px 0',
          }}
        >
          ‹
        </button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>수면 기록</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {formatDateKo(today)}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, padding: '8px 24px 0', overflow: 'auto' }}>
        {/* 별점 섹션 */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 20,
            padding: '32px 24px',
            marginBottom: 16,
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: 'var(--color-text-secondary)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            어젯밤 수면은{'\n'}어떠셨나요?
          </p>
          <StarRating value={stars} onChange={setStars} size={52} />
        </div>

        {/* 메모 섹션 */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 16,
            padding: '16px 20px',
            border: '1px solid var(--color-border)',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>오늘의 한마디</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {memo.length} / 100
            </span>
          </div>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value.slice(0, 100))}
            placeholder="수면에 대한 간단한 메모 (선택)"
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 15,
              color: 'var(--color-text)',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 24px 40px' }}>
        <button
          onClick={handleSubmit}
          disabled={!stars}
          style={{
            width: '100%',
            padding: '16px',
            background: stars ? 'var(--color-primary)' : 'var(--color-border)',
            color: stars ? 'white' : 'var(--color-text-muted)',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 14,
            border: 'none',
            cursor: stars ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, color 0.2s',
            boxShadow: stars ? '0 4px 20px rgba(107, 78, 255, 0.4)' : 'none',
          }}
        >
          기록하기
        </button>
      </div>
    </div>
  )
}
