import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'tr'],

  // Used when no locale matches
  defaultLocale: 'tr',
  
  // Don't show locale prefix for default locale
  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs that consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);