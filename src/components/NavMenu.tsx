'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useDictionary, useLocale } from '../i18n/LocaleProvider';
import { SUPPORTED_LOCALES, localeLabels, type Locale } from '../i18n/config';
import { getLocalizedAlternateMap, getRouteIdentifierForPath, getRoutePath } from '../i18n/routing';

import JayPdfLogo from './JayPdfLogo';

export default function NavMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dictionary = useDictionary();
  const locale = useLocale();
  const { nav } = dictionary.components;
  const routes = dictionary.routes;

  const isActive = (path: string) => pathname === path;

  const routeIdentifier = useMemo(() => getRouteIdentifierForPath(locale, pathname), [locale, pathname]);

  const languageOptions = useMemo(
    () => {
      const alternates = routeIdentifier ? getLocalizedAlternateMap(routeIdentifier) : null;
      return SUPPORTED_LOCALES.map(candidateLocale => ({
        locale: candidateLocale,
        href: alternates?.[candidateLocale] ?? getRoutePath(candidateLocale, 'home'),
      }));
    },
    [routeIdentifier]
  );

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const target = languageOptions.find(option => option.locale === nextLocale)?.href;
    setIsOpen(false);
    router.push(target ?? getRoutePath(nextLocale, 'home'));
  };

  return (
    <nav className="w-full border-b border-[var(--ui)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-[1px] flex flex-wrap justify-between items-center">
        <Link href={routes.home} className="flex items-center group h-[64px] sm:h-[80px] md:h-[92px] my-[1px]" aria-label="JayPDF">
          <JayPdfLogo className="h-full w-auto max-h-full object-contain transition-transform group-hover:scale-[1.02]" />
        </Link>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={nav.menuLabel}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} md:block w-full md:w-auto mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0">
            <li>
              <Link
                href={routes.home}
                className={`${isActive(routes.home) ? 'text-[var(--accent)] font-medium' : 'text-[var(--tx-2)]'} hover:text-[var(--accent)] transition-colors`}
              >
                {nav.home}
              </Link>
            </li>
            <li>
              <Link
                href={routes.faq}
                className={`${isActive(routes.faq) ? 'text-[var(--accent)] font-medium' : 'text-[var(--tx-2)]'} hover:text-[var(--accent)] transition-colors`}
              >
                {nav.faq}
              </Link>
            </li>

            <li className="flex items-center">
              <label className="sr-only" htmlFor="nav-language-select">
                {nav.languageLabel}
              </label>
              <div className="relative inline-block w-full md:w-auto">
                <select
                  id="nav-language-select"
                  className="w-full appearance-none rounded-lg border border-[var(--ui-2)] bg-white pl-3.5 pr-8 py-2 text-sm font-medium text-[var(--tx)] shadow-xs hover:border-[var(--accent)]/50 focus:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer md:w-auto transition-colors"
                  value={locale}
                  onChange={handleLocaleChange}
                >
                  {languageOptions.map(option => (
                    <option key={option.locale} value={option.locale}>
                      {localeLabels[option.locale].nativeName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[var(--tx-3)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
