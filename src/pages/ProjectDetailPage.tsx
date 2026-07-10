import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { marked } from 'marked';
import './ProjectDetailPage.css';

const README_URLS = {
  en: 'https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/README.md',
  zh: 'https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/README_zh.md',
};

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/yiaobang/SerialPortToolFX/master/';

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const sanitizeMarkdownHtml = (html: string) => {
  const documentFragment = new DOMParser().parseFromString(html, 'text/html');
  const unsafeElements = documentFragment.querySelectorAll('script, style, iframe, object, embed, link, meta');

  unsafeElements.forEach((element) => element.remove());

  documentFragment.body.querySelectorAll<HTMLElement>('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (name.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if ((name === 'href' || name === 'src') && /^(javascript|data):/i.test(value)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return documentFragment.body.innerHTML;
};

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadReadme = async () => {
      setLoading(true);
      try {
        const lang = i18n.language;
        const url = lang === 'zh' ? README_URLS.zh : README_URLS.en;
        
        let response = await fetch(url);
        
        // Fallback to english if language specific readme is missing
        if (!response.ok && lang === 'zh') {
           response = await fetch(README_URLS.en);
        }

        if (!response.ok) {
          throw new Error(`README request failed: ${response.status}`);
        }

        const text = await response.text();
        if (isMounted) setContent(text);
      } catch (error) {
        console.error('Error loading readme:', error);
        if (isMounted) setContent('# SerialPortToolFX\n\n项目详情加载失败，请访问 GitHub 查看完整信息。');
      }
      if (isMounted) setLoading(false);
    };

    loadReadme();
    return () => { isMounted = false; };
  }, [i18n.language]);



  const renderedContent = useMemo(() => {
    // Convert relative image paths to absolute GitHub RAW URLs
    const textWithImages = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      // If src is already an absolute URL, keep it
      if (src.startsWith('http')) {
        return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />`;
      }
      // Otherwise prepend the raw github content base URL
      const absUrl = `${GITHUB_RAW_BASE}${src.replace(/^\//, '')}`;
      return `<img src="${escapeAttribute(absUrl)}" alt="${escapeAttribute(alt)}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />`;
    });
    
    const html = marked(textWithImages, {
      breaks: true,
      gfm: true
    }) as string;

    return sanitizeMarkdownHtml(html);
  }, [content]);

  return (
    <div className="project-detail-page page-reveal">
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
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
