const STAR_LABELS: Record<number, string> = {
  1: '매우 못 잠',
  2: '못 잠',
  3: '보통',
  4: '잘 잠',
  5: '매우 잘 잠',
}

type Props = {
  value: number | null
  onChange: (stars: 1 | 2 | 3 | 4 | 5) => void
  size?: number
}

export default function StarRating({ value, onChange, size = 44 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star as 1 | 2 | 3 | 4 | 5)}
            style={{
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size * 0.7,
              lineHeight: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 8,
              transition: 'transform 0.15s ease',
              transform: value === star ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`${star}점 - ${STAR_LABELS[star]}`}
          >
            {star <= (value ?? 0) ? '★' : '☆'}
          </button>
        ))}
      </div>

      {/* 선택된 별점 레이블 */}
      <div
        style={{
          height: 24,
          fontSize: 15,
          fontWeight: 600,
          color: value ? 'var(--color-moon)' : 'var(--color-text-muted)',
          transition: 'color 0.2s',
        }}
      >
        {value ? STAR_LABELS[value] : '별점을 선택해주세요'}
      </div>
    </div>
  )
}
