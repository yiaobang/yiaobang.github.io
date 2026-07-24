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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      <button
        className="language-selector-pill"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        aria-controls="language-menu"
      >
        <span className="language-label">{currentConfig.display}</span>
        <span className={`chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">↓</span>
      </button>

      <div
        className={`language-dropdown ${isOpen ? 'show' : ''}`}
        id="language-menu"
        aria-hidden={!isOpen}
      >
        {langConfig.map((lang) => (
          <button
            type="button"
            key={lang.code}
            className={`dropdown-item ${currentLang === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
            aria-current={currentLang === lang.code ? 'true' : undefined}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div
        className={`mobile-language-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`mobile-language-sheet ${isOpen ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="language-sheet-title"
      >
        <div className="sheet-handle" aria-hidden="true"></div>
        <div className="sheet-header">
           <h3 id="language-sheet-title">{currentLang === 'zh' ? '选择语言' : currentLang === 'ja' ? '言語を選択' : 'Select Language'}</h3>
        </div>
        <div className="sheet-items">
          {langConfig.map((lang) => (
            <button
              type="button"
              key={lang.code}
              className={`sheet-item ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-current={currentLang === lang.code ? 'true' : undefined}
            >
              <span className="item-label">{lang.label}</span>
              {currentLang === lang.code && <span className="item-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
        <button className="sheet-close" onClick={() => setIsOpen(false)}>
          {currentLang === 'zh' ? '取消' : currentLang === 'ja' ? 'キャンセル' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
