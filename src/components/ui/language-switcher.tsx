'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageToggle = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    router.push(pathname, {locale: newLocale});
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100"
    >
      {locale === 'tr' ? 'EN' : 'TR'}
    </button>
  );
}