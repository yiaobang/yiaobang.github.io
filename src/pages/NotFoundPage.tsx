import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="not-found-page page-reveal">
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1 className="not-found-title">{t('not_found_title')}</h1>
      <p className="not-found-text">{t('not_found_desc')}</p>
      <button
        type="button"
        className="not-found-action"
        onClick={() => navigate('/', { replace: true })}
      >
        <span aria-hidden="true">←</span>
        {t('back_to_home')}
      </button>
    </div>
  );
};

export default NotFoundPage;
