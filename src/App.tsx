import { useState, useEffect } from 'react'
import { appLogin, grantPromotionReward, GoogleAdMob } from '@apps-in-toss/web-bridge'
import type { ShowAdMobEvent } from '@apps-in-toss/web-bridge'
import { useSettings } from './hooks/useSettings'
import { useSleepRecords } from './hooks/useSleepRecords'
import { useMoonState } from './hooks/useMoonState'
import OnboardingPage from './pages/OnboardingPage'
import MainPage from './pages/MainPage'
import RecordPage from './pages/RecordPage'
import RecordCompletePage from './pages/RecordCompletePage'
import FullMoonPage from './pages/FullMoonPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import LoginBottomSheet from './components/LoginBottomSheet'
import type { Page, SleepRecord } from './types'

// 테스트 광고 그룹 ID (실제 배포 시 콘솔에서 발급된 ID로 교체)
const AD_GROUP_ID = 'ait-ad-test-rewarded-id'
// 프로모션 코드 (앱인토스 콘솔에서 발급 후 교체 필요)
const PROMOTION_CODE = 'DALBIT_SLEEP_FULLMOON'
const PROMOTION_AMOUNT = 100

/** 보상형 광고를 Promise로 래핑 — 시청 완료 시 true, 스킵/실패 시 false */
function waitForRewardedAd(adGroupId: string): Promise<boolean> {
  return new Promise(resolve => {
    if (!GoogleAdMob.loadAppsInTossAdMob.isSupported()) {
      resolve(false)
      return
    }
    GoogleAdMob.loadAppsInTossAdMob({
      options: { adGroupId },
      onEvent: loadEvent => {
        if (loadEvent.type === 'loaded') {
          GoogleAdMob.showAppsInTossAdMob({
            options: { adGroupId },
            onEvent: (showEvent: ShowAdMobEvent) => {
              if (showEvent.type === 'userEarnedReward') resolve(true)
              else if (showEvent.type === 'dismissed' || showEvent.type === 'failedToShow') resolve(false)
            },
            onError: () => resolve(false),
          })
        }
      },
      onError: () => resolve(false),
    })
  })
}

export default function App() {
  const { settings, completeOnboarding } = useSettings()
  const { records, addRecord, getTodayRecord } = useSleepRecords()
  const { moonState, addPieces, completeFullMoon, claimReward, targetPieces } = useMoonState()

  const [page, setPage] = useState<Page>(settings.onboardingDone ? 'main' : 'onboarding')
  const [completedRecord, setCompletedRecord] = useState<SleepRecord | null>(null)
  const [loginSheetOpen, setLoginSheetOpen] = useState(false)
  const [pendingClaim, setPendingClaim] = useState(false)

  // 보름달 완성 감지
  useEffect(() => {
    if (moonState.pendingReward && page !== 'fullmoon') setPage('fullmoon')
  }, [moonState.pendingReward, page])

  const handleOnboardingDone = () => {
    completeOnboarding()
    setPage('main')
  }

  const handleRecordSubmit = (stars: 1 | 2 | 3 | 4 | 5, memo?: string) => {
    const record = addRecord(stars, memo)
    addPieces(record.moonPieces) // 항상 최소 1조각 (PRD v1.1)
    setCompletedRecord(record)
    setPage('record-complete')
  }

  // 포인트 전환 버튼 → 로그인 바텀싯 오픈
  const handleClaimPoints = () => {
    setPendingClaim(true)
    setLoginSheetOpen(true)
  }

  // 로그인 동의 후 → appLogin + 보상형 광고 + 프로모션 포인트 지급
  const handleLoginAgree = async () => {
    setLoginSheetOpen(false)
    if (!pendingClaim) return

    try {
      // 1. 토스 로그인
      await appLogin()

      // 2. 보상형 광고 시청
      await waitForRewardedAd(AD_GROUP_ID)

      // 3. 프로모션 포인트 지급
      const result = await grantPromotionReward({
        params: { promotionCode: PROMOTION_CODE, amount: PROMOTION_AMOUNT },
      })

      if (result && result !== 'ERROR' && 'key' in result) {
        // 포인트 지급 성공 → 로컬 포인트 기록
        claimReward()
      }
    } catch (e) {
      console.error('포인트 지급 중 오류:', e)
    }

    // 광고/지급 성공 여부와 무관하게 보름달 완성 처리
    completeFullMoon()
    setPendingClaim(false)
  }

  const handleFullMoonClaim = async () => {
    // FullMoonPage에서 CTA 탭 → 로그인 바텀싯 오픈
    handleClaimPoints()
  }

  const handleFullMoonSkip = () => {
    completeFullMoon()
    setPage('main')
  }

  return (
    <>
      {/* 페이지 라우팅 */}
      {page === 'onboarding' && (
        <OnboardingPage onDone={handleOnboardingDone} />
      )}

      {page === 'main' && (
        <MainPage
          moonState={moonState}
          records={records}
          todayRecord={getTodayRecord()}
          targetPieces={targetPieces}
          onRecord={() => setPage('record')}
          onStats={() => setPage('stats')}
          onSettings={() => setPage('settings')}
          onClaimPoints={handleClaimPoints}
        />
      )}

      {page === 'record' && (
        <RecordPage
          onSubmit={handleRecordSubmit}
          onBack={() => setPage('main')}
        />
      )}

      {page === 'record-complete' && completedRecord && (
        <RecordCompletePage
          record={completedRecord}
          moonState={moonState}
          targetPieces={targetPieces}
          onDone={() => {
            setCompletedRecord(null)
            setPage('main')
          }}
        />
      )}

      {page === 'fullmoon' && (
        <FullMoonPage
          targetPieces={targetPieces}
          onClaim={handleFullMoonClaim}
          onSkip={handleFullMoonSkip}
        />
      )}

      {page === 'stats' && (
        <StatsPage
          records={records}
          moonState={moonState}
          onBack={() => setPage('main')}
        />
      )}

      {page === 'settings' && (
        <SettingsPage onBack={() => setPage('main')} />
      )}

      {/* 전역 로그인 바텀싯 */}
      <LoginBottomSheet
        open={loginSheetOpen}
        onClose={() => {
          setLoginSheetOpen(false)
          setPendingClaim(false)
        }}
        onAgree={handleLoginAgree}
      />
    </>
  )
}
