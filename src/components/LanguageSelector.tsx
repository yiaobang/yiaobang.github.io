import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  // 确保当前语言值匹配选项
  const currentLang = ['zh', 'en', 'ja'].includes(i18n.language) ? i18n.language : 'en';

  const langLabels: Record<string, string> = {
    'zh': '中文',
    'en': 'EN',
    'ja': '日本語'
  };

  return (
    <div className="language-selector">
      <span className="language-icon">🌐</span>
      <span className="language-hint">
        {langLabels[currentLang] || 'Language'}
      </span>
      <select onChange={handleLanguageChange} value={currentLang}>
        <option value="zh">中文</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
};

export default LanguageSelector;