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
      icon: '⚙️',
      link: '/project/serial-tool',
      isInternal: true
    },
    {
      id: 'personal-website',
      titleKey: 'project_website_title',
      descKey: 'project_website_desc',
      tech: ['React', 'TypeScript', 'Vite'],
      statusKey: 'status_in_progress',
      icon: '✨',
      link: 'https://github.com/yiaobang/yiaobang.github.io',
      isInternal: false
    }
  ];

  return (
    <div className="projects-page page-reveal">
      <div className="projects-container">
        <div className="projects-header">
          <Link to="/" className="back-link">
            {t('back_to_home')}
          </Link>
          <h1 className="projects-title">
            <span className="text">{t('projects_page_title').replace('💻 ', '')}</span>
          </h1>
          <p className="projects-subtitle">{t('projects_subtitle')}</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const CardWrapper = project.isInternal ? Link : 'a';
            const wrapperProps = project.isInternal 
              ? { to: project.link, className: 'project-card bento-link' }
              : { href: project.link, target: '_blank', rel: 'noopener noreferrer', className: 'project-card bento-link' };

            return (
              <CardWrapper key={project.id} {...wrapperProps as any}>
                <div className="project-content-inner">
                  <div className="project-top">
                    <h3 className="project-name">{t(project.titleKey)}</h3>
                    <span className={`project-status ${project.statusKey === 'status_completed' ? 'completed' : 'in-progress'}`}>
                      {t(project.statusKey)}
                    </span>
                  </div>
                  
                  <p className="project-desc">{t(project.descKey)}</p>
                  
                  <div className="project-tech-clean">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-hash">#{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="bento-icon-bg project-bg-icon">{project.icon}</div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;