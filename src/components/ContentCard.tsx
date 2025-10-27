import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ContentCard.css';

interface ContentCardProps {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  linkTo: string;
  buttonTextKey: string;
}

const ContentCard = ({ icon, titleKey, descriptionKey, linkTo, buttonTextKey }: ContentCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="content-item">
      <div className="item-icon">{icon}</div>
      <h2 className="item-title">{t(titleKey)}</h2>
      <p className="item-description">{t(descriptionKey)}</p>
      <Link to={linkTo} className="item-button">
        {t(buttonTextKey)} →
      </Link>
    </div>
  );
};

export default ContentCard;