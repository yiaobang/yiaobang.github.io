import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [isOpening, setIsOpening] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // Choose font class based on current language
  // 'Zhi Mang Xing' is great for Chinese, 'Caveat' is great for English/handwritten feel
  const currentLang = i18n.language;
  const fontClass = (currentLang === 'zh' || currentLang === 'ja') ? 'font-stylized-asia' : 'font-stylized-west';

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      setShowProgress(false);
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (!showProgress) return null;

  return (
    <div className={`curtain-splash-root ${isOpening ? 'opening' : ''}`}>
      {/* Vertical curtains (Top/Bottom) - Cooler "Shutter" effect */}
      <div className="curtain curtain-top">
        <div className="curtain-edge" />
      </div>
      <div className="curtain curtain-bottom">
        <div className="curtain-edge" />
      </div>
      
      {/* Centered welcome text with artistic font */}
      <div className="welcome-container">
        <h1 className={`welcome-text ${fontClass}`}>{t('welcome')}</h1>
        <div className="welcome-glow" />
      </div>
    </div>
  );
};

export default SplashScreen;
