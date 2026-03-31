import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = ['zh', 'en', 'ja'].includes(i18n.language) ? i18n.language : 'en';

  const langConfig = [
    { code: 'zh', label: '中文', display: '中文' },
    { code: 'en', label: 'English', display: 'EN' },
    { code: 'ja', label: '日本語', display: '日本語' }
  ];

  const currentConfig = langConfig.find(l => l.code === currentLang) || langConfig[1];

  return (
    <div className={`language-selector-wrapper ${isOpen ? 'active' : ''}`} ref={containerRef}>
      <div 
        className="language-selector-pill" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-icon">🌐</span>
        <span className="language-label">{currentConfig.display}</span>
        <span className={`chevron ${isOpen ? 'open' : ''}`}>▾</span>
      </div>

      {isOpen && (
        <div className="language-dropdown">
          {langConfig.map((lang) => (
            <div 
              key={lang.code}
              className={`dropdown-item ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;