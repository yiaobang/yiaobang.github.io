import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { t } = useTranslation();

  const projects = [
    {
      id: 'serial-tool',
      titleKey: 'project_serial_tool_title',
      descKey: 'project_serial_tool_desc',
      tech: ['JavaFX', 'Java', 'i18n'],
      statusKey: 'status_completed',
      github: 'https://github.com/yiaobang/SerialPortTool'
    },
    {
      id: 'personal-website',
      titleKey: 'project_website_title',
      descKey: 'project_website_desc',
      tech: ['React', 'TypeScript', 'CSS'],
      statusKey: 'status_in_progress',
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
          <h1 className="projects-title">
            <span className="emoji">💻 </span>
            <span className="text">{t('projects_page_title').replace('💻 ', '')}</span>
          </h1>
          <p className="projects-subtitle">{t('projects_subtitle')}</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3 className="project-name">{t(project.titleKey)}</h3>
                <span className={`project-status ${project.statusKey === 'status_completed' ? 'completed' : 'in-progress'}`}>
                  {t(project.statusKey)}
                </span>
              </div>
              
              <p className="project-desc">{t(project.descKey)}</p>
              
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