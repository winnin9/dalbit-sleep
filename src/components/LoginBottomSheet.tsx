import { useState } from 'react'
import { BottomSheet, TextButton, Spacing } from '@toss/tds-mobile'
import { adaptive } from '../tokens'

type Props = {
  open: boolean
  onClose: () => void
  onAgree: () => void
}

const AGREEMENTS = [
  { id: 'privacy', label: '개인정보 수집·이용 동의 (필수)', required: true, hasLink: true },
  { id: 'service', label: '서비스 이용약관 동의 (필수)', required: true, hasLink: true },
  { id: 'age', label: '만 14세 이상 확인 (필수)', required: true, hasLink: false },
]

export default function LoginBottomSheet({ open, onClose, onAgree }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const allRequired = AGREEMENTS.filter(a => a.required).every(a => checked[a.id])

  const toggleAll = () => {
    if (allRequired) {
      setChecked({})
    } else {
      const all: Record<string, boolean> = {}
      AGREEMENTS.forEach(a => { all[a.id] = true })
      setChecked(all)
    }
  }

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <BottomSheet
      header={
        <BottomSheet.Header>
          달빛수면 로그인을 위해 꼭 필요한 동의만 추렸어요
        </BottomSheet.Header>
      }
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.CTA
          bottomAccessory={
            <TextButton size="xsmall" variant="underline" onClick={onClose}>
              다음에
            </TextButton>
          }
          color="primary"
          variant="fill"
          disabled={!allRequired}
          onClick={onAgree}
        >
          동의하고 시작하기
        </BottomSheet.CTA>
      }
    >
      {/* 전체 동의 */}
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: `1px solid ${adaptive.grey100}`,
          marginBottom: 4,
        }}
      >
        <button
          onClick={toggleAll}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: allRequired ? adaptive.blue500 : 'transparent',
            border: `2px solid ${allRequired ? adaptive.blue500 : adaptive.grey300}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {allRequired && (
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>
          )}
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: adaptive.grey900 }}>
          아래 내용에 모두 동의해요
        </span>
      </div>

      {AGREEMENTS.map(item => (
        <div
          key={item.id}
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            onClick={() => toggle(item.id)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: checked[item.id] ? adaptive.blue500 : 'transparent',
              border: `2px solid ${checked[item.id] ? adaptive.blue500 : adaptive.grey300}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {checked[item.id] && (
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
            )}
          </button>
          <span style={{ flex: 1, fontSize: 14, color: adaptive.grey800 }}>
            {item.label}
          </span>
          {item.hasLink && (
            <span style={{ fontSize: 13, color: adaptive.grey400 }}>›</span>
          )}
        </div>
      ))}

      <Spacing size={8} />
    </BottomSheet>
  )
}
