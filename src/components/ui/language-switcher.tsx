'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {cn} from '@/lib/utils'

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, {locale: newLocale});
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg [color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-surface-secondary)] hover:[color:var(--color-theme-text-primary)]"
        aria-label={t('header.language')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 z-20 w-full rounded-lg shadow-lg border py-1 [background-color:var(--color-theme-surface-secondary)] [border-color:var(--color-theme-border-primary)]">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  locale === language.code 
                    ? "[color:var(--color-theme-primary-600)] [background-color:var(--color-theme-primary-50)] font-medium"
                    : "[color:var(--color-theme-text-primary)] hover:[background-color:var(--color-theme-surface-secondary)]"
                )}
              >
                <span className="text-base">{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <span className="ml-auto [color:var(--color-theme-primary-600)]">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}