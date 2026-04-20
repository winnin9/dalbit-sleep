import type { MoonPhase } from '../types'

export const TUTORIAL_MOON_PIECES = 5  // 첫 보름달 (빠른 성취)
export const FULL_MOON_PIECES = 15     // 일반 보름달

/**
 * 별점에 따른 달빛 조각 수 반환 (PRD v1.1 - Option C)
 * 1~5점 모두 1조각 반환 (기록 자체를 보상)
 */
export function getMoonPieces(_stars: number): 1 {
  return 1
}

/**
 * 조각 수에 따른 달 위상 반환
 */
export function getMoonPhase(pieces: number): MoonPhase {
  if (pieces === 0) return 'new'
  if (pieces <= 4) return 'crescent'
  if (pieces <= 7) return 'quarter'
  if (pieces <= 10) return 'half'
  if (pieces <= 13) return 'gibbous'
  return 'full'
}

/**
 * 조각 수를 0~1 비율로 변환 (SVG 렌더링용)
 */
export function getMoonFillRatio(pieces: number): number {
  return Math.min(pieces / FULL_MOON_PIECES, 1)
}

/**
 * 보름달 달성 여부
 */
export function isFullMoon(pieces: number): boolean {
  return pieces >= FULL_MOON_PIECES
}

/**
 * 달 위상에 따른 한국어 설명
 */
export function getMoonPhaseName(phase: MoonPhase): string {
  switch (phase) {
    case 'new': return '초승달'
    case 'crescent': return '그믐달'
    case 'quarter': return '상현달'
    case 'half': return '반달'
    case 'gibbous': return '볼록달'
    case 'full': return '보름달'
  }
}

/**
 * 조각 수에 따른 Toss CDN 달 이모지 이미지 URL
 * u1F311(🌑) ~ u1F315(🌕)
 */
export function getMoonImageUrl(pieces: number): string {
  const base = 'https://static.toss.im/2d-emojis/png/4x'
  if (pieces === 0) return `${base}/u1F311.png` // 🌑 삭월
  if (pieces <= 4) return `${base}/u1F312.png`  // 🌒 초승달
  if (pieces <= 7) return `${base}/u1F313.png`  // 🌓 상현달
  if (pieces <= 10) return `${base}/u1F314.png` // 🌔 볼록달
  return `${base}/u1F315.png`                   // 🌕 보름달
}

/**
 * 별점에 따른 응원 메시지 (PRD v1.1 Option C — 모든 별점에 조각 지급)
 */
export function getStarMessage(stars: number): string {
  switch (stars) {
    case 5: return '완벽한 수면이에요! 맑은 달빛 조각을 드릴게요 ✨'
    case 4: return '좋은 수면이에요! 밝은 달빛 조각이 모였어요 🌙'
    case 3: return '보통의 수면이었군요. 은은한 달빛 조각을 드릴게요 🌙'
    case 2: return '많이 지치셨겠어요. 위로의 달빛 조각을 드릴게요 🌙'
    case 1: return '오늘 밤은 꼭 푹 주무세요. 위로의 달빛 조각을 드릴게요 🌙'
    default: return '오늘도 기록해주셔서 고마워요. 달빛 조각이 찾아왔어요 🌙'
  }
}
