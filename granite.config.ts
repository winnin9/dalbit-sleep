import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'dalbit-sleep',
  brand: {
    displayName: '달빛수면',
    primaryColor: '#6B4EFF',
    icon: '', // 앱인토스 콘솔에서 아이콘 업로드 후 URL 입력
  },
  permissions: [],
  navigationBar: {
    withBackButton: true,
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
    },
  },
  webViewProps: {
    type: 'partner',
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
  },
})
