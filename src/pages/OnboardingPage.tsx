import { useState } from 'react'
import {
  Asset,
  Top,
  ListHeader,
  StepperRow,
  FixedBottomCTA,
  Spacing,
} from '@toss/tds-mobile'
import { adaptive } from '../tokens'
import { useSettings } from '../hooks/useSettings'
import { getMoonImageUrl } from '../utils/moonUtils'

type Props = {
  onDone: () => void
}

const STEPS = [
  { title: '기상 후 어젯밤 수면을 별점으로 기록해요' },
  { title: '어떤 별점이든 기록하기만 하면 매일 달빛 조각이 1개씩 쌓여요' },
  { title: '첫 5조각 달성 후 토스 포인트를 받아요! 이후엔 15조각마다 받아요' },
]

type Slide = 'intro' | 'how' | 'notify'
const SLIDES: Slide[] = ['intro', 'how', 'notify']

export default function OnboardingPage({ onDone }: Props) {
  const [slideIdx, setSlideIdx] = useState(0)
  const { settings, updateNotificationTime, updateNotificationEnabled } = useSettings()
  const slide = SLIDES[slideIdx]
  const isLast = slideIdx === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) onDone()
    else setSlideIdx(i => i + 1)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 진행 인디케이터 */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', paddingTop: 16 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === slideIdx ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === slideIdx ? adaptive.blue500 : adaptive.grey200,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* ── 슬라이드 1: 인트로 ── */}
        {slide === 'intro' && (
          <>
            <Spacing size={12} />
            <Top
              title={
                <Top.TitleParagraph color={adaptive.grey900}>
                  잘 잔 날{'\n'}달빛을 모아요
                </Top.TitleParagraph>
              }
            />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <Asset.Image
                frameShape={{ width: 220 }}
                src={getMoonImageUrl(10)}
                aria-hidden={true}
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            <Spacing size={8} />
            <div style={{ padding: '0 24px' }}>
              <p style={{ fontSize: 15, color: adaptive.grey600, lineHeight: 1.7, textAlign: 'center' }}>
                매일 아침, 어젯밤 수면을 별점으로 기록하고{'\n'}달빛 조각을 모아 보름달을 완성해보세요.{' '}{'\n'}잘 잔 날도, 못 잔 날도 기록하면 조각이 쌓여요! 🌙
              </p>
            </div>
          </>
        )}

        {/* ── 슬라이드 2: 사용법 ── */}
        {slide === 'how' && (
          <>
            <Spacing size={12} />
            <Top
              title={
                <Top.TitleParagraph color={adaptive.grey900}>
                  이렇게{'\n'}사용해요
                </Top.TitleParagraph>
              }
            />
            <Spacing size={8} />
            <ListHeader
              title={
                <ListHeader.TitleParagraph
                  color={adaptive.grey800}
                  fontWeight="bold"
                  typography="t5"
                >
                  달빛 모으는 방법
                </ListHeader.TitleParagraph>
              }
              descriptionPosition="bottom"
            />
            {STEPS.map((step, i) => (
              <StepperRow
                key={i}
                left={<StepperRow.NumberIcon number={(i + 1) as 1 | 2 | 3 | 4 | 5} />}
                center={
                  <StepperRow.Texts
                    type="A"
                    title={step.title}
                    description=""
                  />
                }
                hideLine={i === STEPS.length - 1}
              />
            ))}
          </>
        )}

        {/* ── 슬라이드 3: 알림 설정 ── */}
        {slide === 'notify' && (
          <>
            <Spacing size={12} />
            <Top
              title={
                <Top.TitleParagraph color={adaptive.grey900}>
                  기록 알림{'\n'}시간을 설정해요
                </Top.TitleParagraph>
              }
            />
            <Spacing size={24} />
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: adaptive.grey50,
                  borderRadius: 12,
                }}
              >
                <span style={{ fontSize: 15, color: adaptive.grey900 }}>알림 받기</span>
                <button
                  onClick={() => updateNotificationEnabled(!settings.notificationEnabled)}
                  style={{
                    width: 48,
                    height: 28,
                    borderRadius: 14,
                    background: settings.notificationEnabled ? adaptive.blue500 : adaptive.grey300,
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: settings.notificationEnabled ? 23 : 3,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'white',
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
              </div>

              {settings.notificationEnabled && (
                <div
                  style={{
                    padding: '16px 20px',
                    background: adaptive.grey50,
                    borderRadius: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 15, color: adaptive.grey900 }}>알림 시간</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: adaptive.blue500 }}>
                      오전 {settings.notificationHour}시
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={11}
                    value={settings.notificationHour}
                    onChange={e => updateNotificationTime(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: adaptive.blue500 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: adaptive.grey500 }}>오전 6시</span>
                    <span style={{ fontSize: 11, color: adaptive.grey500 }}>오전 11시</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <Spacing size={100} />
      </div>

      <FixedBottomCTA onClick={handleNext}>
        {isLast ? '시작하기' : '다음'}
      </FixedBottomCTA>
    </div>
  )
}
