import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../types';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    // Sync both systems
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex items-center space-x-2">
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            language === lang.code
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={lang.label}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
