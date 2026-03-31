import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReadme = async () => {
      setLoading(true);
      try {
        const lang = i18n.language;
        let url = 'https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/README.md';
        
        if (lang === 'zh') url = 'https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/README_zh.md';
        
        let response = await fetch(url);
        
        // Fallback to english if language specific readme is missing
        if (!response.ok && lang === 'zh') {
           response = await fetch('https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/README.md');
        }

        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading readme:', error);
        setContent('# SerialPortToolFX\n\n项目详情加载失败，请访问 GitHub 查看完整信息。');
      }
      setLoading(false);
    };

    loadReadme();
  }, [i18n.language]);



  const formatMarkdown = (text: string) => {
    // Convert relative image paths to absolute GitHub RAW URLs
    const textWithImages = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      // If src is already an absolute URL, keep it
      if (src.startsWith('http')) {
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />`;
      }
      // Otherwise prepend the raw github content base URL
      const absUrl = `https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/${src.replace(/^\//, '')}`;
      return `<img src="${absUrl}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />`;
    });
    
    return marked(textWithImages, {
      breaks: true,
      gfm: true
    }) as string;
  };

  return (
    <div className="project-detail-page">
      {/* Floating Control Bar */}
      <div className="project-nav-bar">
        <button className="nav-btn back-glass" onClick={() => navigate('/projects')}>
          {t('back_to_projects')}
        </button>
        <a 
          href="https://github.com/yiaobang/SerialPortToolFX" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-btn github-glass"
        >
          {t('view_github')} ↗
        </a>
      </div>

      <div className="project-hero">
        <div className="hero-content">
          <h1 className="hero-title">SerialPortToolFX</h1>
          <div className="project-badge-row">
            <span className="badge-glass">JavaFX</span>
            <span className="badge-glass">v2.0.1</span>
            <span className="badge-glass active">Live</span>
          </div>
        </div>
        <div className="hero-bg-icon">⚙️</div>
      </div>

      <div className="project-detail-container">
        <div className="project-content-glass">
          {loading ? (
            <div className="loading-shimmer">
              <div className="shimmer-line"></div>
              <div className="shimmer-line short"></div>
              <div className="shimmer-line"></div>
            </div>
          ) : (
            <div 
              className="markdown-content-enhanced"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(content) as string }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;