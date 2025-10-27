import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { t } = useTranslation();

  const projects = [
    {
      id: 'serial-tool',
      title: 'SerialPortToolFX',
      description: '一个功能完善的跨平台串口调试工具，支持多语言界面。',
      tech: ['JavaFX', 'Java', 'i18n'],
      status: '已完成',
      github: 'https://github.com/yiaobang/SerialPortTool'
    },
    {
      id: 'personal-website',
      title: '个人网站',
      description: '基于React的响应式个人网站，展示旅行摄影和项目作品。',
      tech: ['React', 'TypeScript', 'CSS'],
      status: '进行中',
      github: 'https://github.com/yiaobang/yiaobang.github.io'
    }
  ];

  return (
    <div className="projects-page">
      <div className="projects-container">
        <div className="projects-header">
          <Link to="/" className="back-link">
            {t('back_to_home')}
          </Link>
          <h1 className="projects-title">💻 我的项目</h1>
          <p className="projects-subtitle">开发项目展示</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3 className="project-name">{project.title}</h3>
                <span className={`project-status ${project.status === '已完成' ? 'completed' : 'in-progress'}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="project-desc">{project.description}</p>
              
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <div className="project-actions">
                {project.id !== 'personal-website' && (
                  <Link 
                    to={`/project/${project.id}`} 
                    className="project-btn primary"
                  >
                    {t('view_details')}
                  </Link>
                )}
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`project-btn ${project.id === 'personal-website' ? 'primary' : 'secondary'}`}
                >
                  {t('view_github')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;