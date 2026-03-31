import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, TranslationKey } from './translations';

export const useTranslation = () => {
  const { selectedLanguage } = useAppStore();

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[selectedLanguage][key] || key;
    },
    [selectedLanguage]
  );

  const getLanguageName = (lang: 'zh-TW' | 'zh-CN' | 'en') => {
    const names = {
      'zh-TW': '繁體中文',
      'zh-CN': '简体中文',
      en: 'English',
    };
    return names[lang];
  };

  return { t, selectedLanguage, getLanguageName };
};
