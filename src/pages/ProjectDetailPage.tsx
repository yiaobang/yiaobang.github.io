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
        let filename = 'readme-en.md';
        
        if (lang === 'zh') filename = 'readme-zh.md';
        else if (lang === 'ja') filename = 'readme-ja.md';
        
        const response = await fetch(`/src/data/${filename}`);
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

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    
    const renderer = new marked.Renderer();
    renderer.image = (href, title, text) => {
      return `<img src="/serialport/${href}" alt="${text}" title="${title || ''}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />`;
    };
    
    marked.setOptions({ renderer });
  }, []);

  const formatMarkdown = (text: string) => {
    return marked(text) as string;
  };

  return (
    <div className="project-detail-page">
      <div className="project-header">
        <button className="back-button" onClick={() => navigate('/')}>
          {t('back_to_home')}
        </button>
        <h1 className="project-title">SerialPortToolFX</h1>
        <div className="project-actions">
          <a 
            href="https://github.com/yiaobang/SerialPortToolFX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-button"
          >
            {t('view_github')} →
          </a>
        </div>
      </div>

      <div className="project-content">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(content) as string }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;