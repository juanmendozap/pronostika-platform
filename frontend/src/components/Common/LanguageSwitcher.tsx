import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
      >
        <div className="flex items-center space-x-1">
          {language === 'en' ? (
            <>
              <span className="text-lg">🇺🇸</span>
              <span>EN</span>
            </>
          ) : (
            <>
              <span className="text-lg">🇪🇸</span>
              <span>ES</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default LanguageSwitcher;