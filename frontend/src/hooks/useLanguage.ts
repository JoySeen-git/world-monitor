import { useState, useEffect } from 'react'
import { translations, languages, type TranslationKey } from '../locales'

export type { TranslationKey }

export function useLanguage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    // 从 localStorage 读取语言设置
    const savedLang = localStorage.getItem('language') as 'zh' | 'en' | null
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLang(savedLang)
    }
  }, [])

  const changeLanguage = (newLang: 'zh' | 'en') => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations['zh'][key] || key
  }

  return {
    lang,
    t,
    changeLanguage,
    languages
  }
}
