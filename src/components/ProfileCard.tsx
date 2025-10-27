import { useTranslation } from 'react-i18next';
import { LocationIcon, EmailIcon, GitHubIcon } from './Icons';
import './ProfileCard.css';

const ProfileCard = () => {
  const { t } = useTranslation();

  return (
    <section className="profile-section">
      <div className="profile-card">
        <img src="/Tohru.jfif" alt="Profile" className="profile-avatar" />
        <h1 className="profile-name">{t('profile.name')}</h1>
        <div className="profile-info">
          <div className="profile-location">
            <LocationIcon />
            Osaka
          </div>
          <div className="profile-email">
            <EmailIcon />
            yiaobang@gmail.com
          </div>
          <a href="https://github.com/yiaobang" target="_blank" rel="noopener noreferrer" className="profile-github">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;