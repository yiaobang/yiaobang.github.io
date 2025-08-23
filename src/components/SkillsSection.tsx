import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './LifeCategoriesSection.css';

const LifeCategoriesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categoriesData = [
    { key: 'travel', icon: '✈️', description: 'Exploring new places and cultures', clickable: true },
    { key: 'cooking', icon: '🍳', description: 'Trying local cuisines and recipes', clickable: false },
    { key: 'study', icon: '📚', description: 'Academic life and learning experiences', clickable: false },
    { key: 'daily', icon: '🌟', description: 'Everyday moments and discoveries', clickable: false }
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
            <p className="category-description">{category.description}</p>
            <div className={category.clickable ? "available" : "coming-soon"}>
              {category.clickable ? 'View →' : 'Coming Soon...'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LifeCategoriesSection;