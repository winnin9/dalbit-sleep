import { useStorage } from './useStorage'
import { FULL_MOON_PIECES, TUTORIAL_MOON_PIECES } from '../utils/moonUtils'
import type { MoonState } from '../types'

const STORAGE_KEY = 'dalbit_moon_state'

const defaultMoonState: MoonState = {
  currentPieces: 0,
  totalCompleted: 0,
  totalPoints: 0,
  pendingReward: false,
  tutorialDone: false,
}

const POINTS_PER_FULLMOON = 100 // 콘솔 프로모션 확정 후 맞게 수정

export function useMoonState() {
  const [moonState, setMoonState] = useStorage<MoonState>(STORAGE_KEY, defaultMoonState)

  /**
   * 현재 목표 조각 수
   * 튜토리얼 미완료 시 5조각, 완료 후 15조각
   */
  const targetPieces = moonState.tutorialDone ? FULL_MOON_PIECES : TUTORIAL_MOON_PIECES

  /** 달빛 조각 추가 */
  const addPieces = (count: number) => {
    const next = moonState.currentPieces + count
    if (next >= targetPieces) {
      setMoonState({
        ...moonState,
        currentPieces: targetPieces,
        pendingReward: true,
      })
    } else {
      setMoonState({ ...moonState, currentPieces: next })
    }
  }

  /**
   * 보름달 완성 처리 (포인트 전환 여부와 무관하게 달 초기화)
   * claimReward() 호출 후 또는 나중에 받기 시 호출
   */
  const completeFullMoon = () => {
    setMoonState({
      ...moonState,
      currentPieces: 0,
      pendingReward: false,
      totalCompleted: moonState.totalCompleted + 1,
      tutorialDone: true, // 첫 완성 이후 일반 모드(15조각)로 전환
    })
  }

  /**
   * 토스 포인트 지급 성공 시 로컬 포인트 적립
   * 실제 grantPromotionReward는 App.tsx에서 호출
   */
  const claimReward = () => {
    setMoonState({
      ...moonState,
      totalPoints: moonState.totalPoints + POINTS_PER_FULLMOON,
    })
  }

  return { moonState, addPieces, completeFullMoon, claimReward, targetPieces }
}
