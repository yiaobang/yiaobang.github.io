import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './LifeCategoriesSection.css';

const LifeCategoriesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categoriesData = [
    { key: 'travel', icon: '✈️', clickable: true },
    { key: 'cooking', icon: '🍳', clickable: false },
    { key: 'study', icon: '📚', clickable: false },
    { key: 'daily', icon: '🌟', clickable: false }
  ];

  const handleCategoryClick = (categoryKey: string) => {
    if (categoryKey === 'travel') {
      navigate('/travel');
    }
  };

  return (
    <section className="categories-section">
      <h2 className="section-title">{t('life_categories')}</h2>
      <div className="categories-grid">
        {categoriesData.map((category) => (
          <div 
            key={category.key} 
            className={`category-card ${category.clickable ? 'clickable' : ''}`}
            onClick={() => category.clickable && handleCategoryClick(category.key)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{t(`categories.${category.key}`)}</h3>
            <p className="category-description">{t(`category_descriptions.${category.key}`)}</p>
            <div className={category.clickable ? "available" : "coming-soon"}>
              {category.clickable ? t('view_arrow') : t('coming_soon')}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LifeCategoriesSection;