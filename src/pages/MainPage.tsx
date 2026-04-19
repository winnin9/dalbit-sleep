import { useState } from 'react'
import {
  Asset,
  ListRow,
  Button,
  Spacing,
  Text,
} from '@toss/tds-mobile'
import { adaptive } from '../tokens'
import type { MoonState, SleepRecord } from '../types'
import SleepCalendar from '../components/SleepCalendar'
import WeekPreview from '../components/WeekPreview'
import MoonProgress from '../components/MoonProgress'
import { getMoonImageUrl } from '../utils/moonUtils'

type Tab = 'home' | 'calendar'

type Props = {
  moonState: MoonState
  records: SleepRecord[]
  todayRecord: SleepRecord | undefined
  targetPieces: number
  onRecord: () => void
  onStats: () => void
  onSettings: () => void
  onClaimPoints: () => void
}

export default function MainPage({
  moonState,
  records,
  todayRecord,
  targetPieces,
  onRecord,
  onStats,
  onSettings,
  onClaimPoints,
}: Props) {
  const [tab, setTab] = useState<Tab>('home')

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
      {/* 상단 네비게이션 바 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          gap: 8,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Asset.Image
          frameShape={Asset.frameShape.CleanW16}
          backgroundColor="transparent"
          src="https://static.toss.im/2d-emojis/png/4x/u1F315.png"
          aria-hidden={true}
          style={{ aspectRatio: '1/1' }}
        />
        <Text color="var(--color-text)" typography="t6" fontWeight="semibold">
          달빛수면
        </Text>
        <div style={{ flex: 1 }} />
        <button
          onClick={onSettings}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          aria-label="설정"
        >
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW20}
            backgroundColor="transparent"
            name="icon-dots-mono"
            color="var(--color-text-secondary)"
            aria-hidden={true}
            ratio="1/1"
          />
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="scroll-y" style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'home' && (
          <>
            <Spacing size={16} />

            {/* 달 이미지 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Asset.Image
                frameShape={Asset.frameShape.CleanW250}
                backgroundColor="transparent"
                src={getMoonImageUrl(moonState.currentPieces)}
                aria-hidden={true}
                style={{ aspectRatio: '1/1' }}
              />
            </div>

            <Spacing size={8} />

            {/* 진행 바 */}
            <div style={{ padding: '0 20px' }}>
              <MoonProgress pieces={moonState.currentPieces} targetPieces={targetPieces} />
            </div>

            <Spacing size={8} />

            {/* 오늘 수면 기록 유도 텍스트 */}
            {!todayRecord && (
              <div style={{ padding: '4px 20px' }}>
                <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  오늘의 수면은 몇 점이었나요? 🌙
                </p>
              </div>
            )}

            {/* 오늘 기록 완료 카드 */}
            {todayRecord && (
              <div style={{ padding: '0 20px' }}>
                <div
                  style={{
                    padding: '14px 16px',
                    background: 'var(--color-bg-card)',
                    borderRadius: 14,
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22 }}>
                    {todayRecord.moonPieces > 0 ? '🌙' : '😴'}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-moon)' }}>
                      {'★'.repeat(todayRecord.stars)}{'☆'.repeat(5 - todayRecord.stars)}
                    </div>
                    {todayRecord.memo && (
                      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        {todayRecord.memo}
                      </div>
                    )}
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-muted)' }}>
                    기록 완료 ✓
                  </div>
                </div>
              </div>
            )}

            <Spacing size={8} />

            {/* 누적 달빛조각 + 포인트 전환 */}
            <ListRow
              left={
                <span style={{ fontSize: 22 }}>🌙</span>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeD"
                  top={`누적 달빛 조각 ${records.reduce((s, r) => s + r.moonPieces, 0)}개`}
                  topProps={{ color: adaptive.grey600 }}
                  bottom={moonState.pendingReward ? '토스 포인트 받기 ✨' : '토스 포인트로 바꾸기'}
                  bottomProps={{ color: moonState.pendingReward ? '#F5C842' : adaptive.blue500, fontWeight: 'bold' }}
                />
              }
              onClick={moonState.pendingReward ? onClaimPoints : undefined}
            />

            <Spacing size={16} />

            {/* 최근 7일 */}
            <div style={{ padding: '0 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                최근 7일
              </div>
              <WeekPreview records={records} />
            </div>

            <Spacing size={24} />

            {/* 기록 버튼 */}
            {!todayRecord && (
              <div style={{ padding: '0 20px' }}>
                <Button
                  size="large"
                  display="block"
                  onClick={onRecord}
                >
                  오늘 수면 기록하기
                </Button>
              </div>
            )}

            <Spacing size={40} />
          </>
        )}

        {tab === 'calendar' && (
          <div style={{ padding: '20px 20px 40px' }}>
            <SleepCalendar records={records} />
          </div>
        )}
      </div>

      {/* 하단 탭 바 */}
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-surface)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {(
          [
            { id: 'home' as Tab, icon: '🌙', label: '홈' },
            { id: 'calendar' as Tab, icon: '📅', label: '달력' },
          ]
        ).map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: tab === item.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === item.id ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
        <button
          onClick={onStats}
          style={{
            flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--color-text-muted)',
          }}
        >
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontSize: 10 }}>통계</span>
        </button>
        <button
          onClick={onSettings}
          style={{
            flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--color-text-muted)',
          }}
        >
          <span style={{ fontSize: 20 }}>⚙️</span>
          <span style={{ fontSize: 10 }}>설정</span>
        </button>
      </div>
    </div>
  )
}
