import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HeroSection.css';

const projects = [
  {
    id: 'kserial',
    href: 'https://github.com/yiaobang/KSerial',
    title: 'KSerial',
    shortTitle: 'KSerial',
    descriptionKey: 'project_kserial_desc',
    tags: ['Kotlin', 'Compose', 'Cross-platform'],
    image: '/projects/kserial-logo.png',
    visualKind: 'icon',
    primary: true,
  },
  {
    id: 'serial-port-tool-fx',
    href: 'https://github.com/yiaobang/SerialPortToolFX',
    title: 'SerialPortToolFX',
    shortTitle: 'SPToolFX',
    descriptionKey: 'project_serial_tool_desc',
    tags: ['Java', 'JavaFX', 'Open source'],
    image: '/projects/serial-port-tool-fx.png',
    visualKind: 'screenshot',
    primary: false,
  },
] as const;

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const usesChineseWriting = activeLanguage.startsWith('zh');
  const usesJapaneseWriting = activeLanguage.startsWith('ja');
  const usesVerticalWriting = usesChineseWriting || usesJapaneseWriting;
  const statementLanguageClass = usesChineseWriting
    ? ' chinese'
    : usesJapaneseWriting
      ? ' japanese'
      : '';
  const subtitle = t('profile.subtitle');
  const subtitleBreakIndex = subtitle.indexOf('，');

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex: number;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % projects.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + projects.length) % projects.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = projects.length - 1;
    else return;

    event.preventDefault();
    setActiveProjectIndex(nextIndex);
    document.getElementById(`project-tab-${projects[nextIndex].id}`)?.focus();
  };

  return (
    <section className="hero-container">
      <div className="hero-layout">
        <header className="hero-masthead">
          <div className="profile-intro">
            <div className="avatar-wrapper">
              <img src="/Tohru.jfif" alt="" className="avatar-img" />
              <span className="avatar-ring" aria-hidden="true" />
            </div>
            <p className="profile-kicker">{t('profile.kicker')}</p>
          </div>

          <nav className="hero-links" aria-label={t('primary_navigation')}>
            <Link to="/travel">{t('categories.travel')}</Link>
            <a href="https://github.com/yiaobang" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="mailto:yiaobang@gmail.com">Email</a>
          </nav>
        </header>

        <section
          className={`hero-statement${usesVerticalWriting ? ' vertical' : ''}${statementLanguageClass}`}
          aria-labelledby="hero-title"
        >
          <h1 className="hero-desc" id="hero-title" lang={activeLanguage}>
            {usesChineseWriting && subtitleBreakIndex >= 0 ? (
              <>
                {subtitle.slice(0, subtitleBreakIndex + 1)}
                <br />
                {subtitle.slice(subtitleBreakIndex + 1)}
              </>
            ) : subtitle}
          </h1>
        </section>

        <section className="featured-projects" aria-labelledby="featured-projects-title">
          <header className="featured-projects-header">
            <h2 id="featured-projects-title">{t('project_title')}</h2>
            <span aria-hidden="true">
              {String(activeProjectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </header>

          <div
            className="project-tabs"
            role="tablist"
            aria-label={t('project_tabs_label')}
          >
            {projects.map((project, index) => (
              <button
                type="button"
                role="tab"
                id={`project-tab-${project.id}`}
                key={project.id}
                className={index === activeProjectIndex ? 'active' : ''}
                aria-selected={index === activeProjectIndex}
                aria-controls={`project-panel-${project.id}`}
                tabIndex={index === activeProjectIndex ? 0 : -1}
                onClick={() => setActiveProjectIndex(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="project-tab-title">{project.title}</span>
                <span className="project-tab-short">{project.shortTitle}</span>
              </button>
            ))}
          </div>

          {projects.map((project, index) => (
            <div
              className="project-panel"
              id={`project-panel-${project.id}`}
              key={project.id}
              role="tabpanel"
              aria-labelledby={`project-tab-${project.id}`}
              hidden={index !== activeProjectIndex}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`project-spotlight ${project.visualKind}${project.primary ? ' primary' : ''}`}
                aria-label={t('visit_project', { name: project.title })}
              >
                <span className="project-entry-visual" aria-hidden="true">
                  <img src={project.image} alt="" />
                </span>

                <span className="project-entry-copy">
                  <span className="project-entry-heading">
                    <strong>{project.title}</strong>
                    {project.primary && <b>{t('project_flagship')}</b>}
                  </span>
                  <em>{t(project.descriptionKey)}</em>
                  <span className="project-entry-meta" aria-hidden="true">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </span>
                  <span className="project-entry-action">
                    {t('project_view_action')}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </a>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
};

export default HeroSection;
