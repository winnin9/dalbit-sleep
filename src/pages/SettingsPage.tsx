import { useSettings } from '../hooks/useSettings'

type Props = {
  onBack: () => void
}

export default function SettingsPage({ onBack }: Props) {
  const { settings, updateNotificationEnabled, updateNotificationTime } = useSettings()

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
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
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>설정</h1>
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflow: 'auto' }}>
        {/* 알림 섹션 */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            알림
          </div>

          {/* 알림 ON/OFF */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 14,
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>수면 기록 알림</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  매일 아침 기록을 알려드려요
                </div>
              </div>
              <button
                onClick={() => updateNotificationEnabled(!settings.notificationEnabled)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: settings.notificationEnabled
                    ? 'var(--color-primary)'
                    : 'var(--color-border)',
                  position: 'relative',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
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

            {/* 알림 시간 */}
            {settings.notificationEnabled && (
              <div style={{ padding: '16px 20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500 }}>알림 시간</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-moon)' }}>
                    오전 {settings.notificationHour}시
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={11}
                  value={settings.notificationHour}
                  onChange={e => updateNotificationTime(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>오전 6시</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>오전 11시</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 앱 정보 */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            앱 정보
          </div>
          <div
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 14,
              border: '1px solid var(--color-border)',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 15 }}>버전</span>
            <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>0.0.1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
