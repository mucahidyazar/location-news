'use client'

import {X, MapPin, Settings, Globe} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useTranslations} from 'next-intl'
import LanguageSwitcher from '@/components/ui/language-switcher'

interface SettingsSidebarProps {
  useCustomIcons: boolean
  onToggleIcons: () => void
  onClose: () => void
}

export default function SettingsSidebar({
  useCustomIcons,
  onToggleIcons,
  onClose,
}: SettingsSidebarProps) {
  const t = useTranslations()

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t('settings.title')}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Map Icons Setting */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t('settings.mapIcons.title')}
          </h3>
          <div className="space-y-2">
            <button
              onClick={onToggleIcons}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                !useCustomIcons
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{t('settings.mapIcons.default')}</div>
              <div className="text-xs opacity-75">{t('settings.mapIcons.defaultDesc')}</div>
            </button>
            <button
              onClick={onToggleIcons}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                useCustomIcons
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{t('settings.mapIcons.custom')}</div>
              <div className="text-xs opacity-75">{t('settings.mapIcons.customDesc')}</div>
            </button>
          </div>
        </div>

        {/* Language Setting */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t('settings.language.title')}
          </h3>
          <div className="p-3 rounded-lg border bg-gray-50">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}