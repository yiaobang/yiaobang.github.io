import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ProjectDetailPage.css';

// 导入README文件
import readmeZh from '../data/readme-zh.md?raw';
import readmeEn from '../data/readme-en.md?raw';
import readmeJa from '../data/readme-ja.md?raw';

const ProjectDetailPage = () => {
  const { t, i18n } = useTranslation();

  const [readmeContent, setReadmeContent] = useState('');
  const [readmeTitle, setReadmeTitle] = useState('');

  useEffect(() => {
    let content = '';
    let title = '';
    
    switch (i18n.language) {
      case 'zh':
        content = readmeZh;
        title = 'SerialPortToolFX - 串口调试工具';
        break;
      case 'ja':
        content = readmeJa;
        title = 'SerialPortToolFX - シリアルポートデバッグツール';
        break;
      default:
        content = readmeEn;
        title = 'SerialPortToolFX - Serial Port Debug Tool';
        break;
    }
    
    setReadmeContent(content);
    setReadmeTitle(title);
  }, [i18n.language]);

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="readme-h1">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="readme-h2">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="readme-h3">{line.substring(4)}</h3>;
      } else if (line.startsWith('#### ')) {
        return <h4 key={index} className="readme-h4">{line.substring(5)}</h4>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="readme-li">{line.substring(2)}</li>;
      } else if (line.startsWith('```')) {
        return <pre key={index} className="readme-code"><code>{line}</code></pre>;
      } else if (line.includes('![')) {
        // 处理图片
        const imgRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = imgRegex.exec(line)) !== null) {
          // 添加图片前的文本
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          
          // 添加图片
          const alt = match[1];
          const src = match[2];
          // 将相对路径转换为绝对路径
          const imageSrc = src.startsWith('http') ? src : `/images/serialport/${src}`;
          parts.push(
            <img 
              key={`img-${index}-${match.index}`} 
              src={imageSrc} 
              alt={alt} 
              className="readme-img"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // 添加剩余文本
        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }
        
        return <p key={index} className="readme-p">{parts}</p>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="readme-p">{line}</p>;
      }
    });
  };

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <Link to="/" className="back-button">
           {t('back_to_home')}
        </Link>
        <h1 className="project-detail-title">{readmeTitle}</h1>
        <div className="project-links">
          <a 
            href="https://github.com/yiaobang/SerialPortToolFX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-button"
          >
            {t('view_on_github')} →
          </a>
        </div>
      </div>
      
      <div className="project-detail-content">
        <div className="readme-content">
          {renderMarkdown(readmeContent)}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;