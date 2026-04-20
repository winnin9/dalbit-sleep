import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'dalbit-sleep',
  brand: {
    displayName: '달빛수면',
    primaryColor: '#6B4EFF',
    icon: 'https://static.toss.im/appsintoss/30067/52d87a07-d44a-4e30-a2c1-36f0c9904b63.png',
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
