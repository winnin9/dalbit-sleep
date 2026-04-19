import { useStorage } from './useStorage'
import type { AppSettings } from '../types'

const STORAGE_KEY = 'dalbit_settings'

const defaultSettings: AppSettings = {
  onboardingDone: false,
  notificationEnabled: true,
  notificationHour: 8,
}

export function useSettings() {
  const [settings, setSettings] = useStorage<AppSettings>(STORAGE_KEY, defaultSettings)

  const completeOnboarding = () => {
    setSettings({ ...settings, onboardingDone: true })
  }

  const updateNotificationEnabled = (enabled: boolean) => {
    setSettings({ ...settings, notificationEnabled: enabled })
  }

  const updateNotificationTime = (hour: number) => {
    const clamped = Math.min(11, Math.max(6, hour))
    setSettings({ ...settings, notificationHour: clamped })
  }

  return {
    settings,
    completeOnboarding,
    updateNotificationEnabled,
    updateNotificationTime,
  }
}
