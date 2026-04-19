/**
 * @tds/token의 adaptive 토큰을 로컬에서 대체
 * 앱인토스 배포 환경에서 @tds/token이 사용 가능해지면 이 파일을 삭제하고
 * import 경로를 '@tds/token'으로 교체
 */

export const adaptive = {
  // Grey scale
  grey50: '#F9FAFB',
  grey100: '#F2F4F6',
  grey200: '#E5E8EB',
  grey300: '#D1D6DB',
  grey400: '#B0B8C1',
  grey500: '#8B95A1',
  grey600: '#6B7684',
  grey700: '#4E5968',
  grey800: '#333D4B',
  grey900: '#191F28',
  greyOpacity600: 'rgba(0, 19, 43, 0.58)',

  // Blue
  blue500: '#3182F6',

  // Yellow
  yellow500: '#F5C842',

  // Green
  green500: '#00C471',

  // Red
  red500: '#F04452',
} as const
