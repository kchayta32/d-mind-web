
import React from 'react';
import { useParams } from 'react-router-dom';
import NaturalDisastersArticle from '@/components/articles/NaturalDisastersArticle';
import EarthquakeThreeCountriesArticle from '@/components/articles/EarthquakeThreeCountriesArticle';
import DisasterTwentyYearsArticle from '@/components/articles/DisasterTwentyYearsArticle';
import ArticleNotFound from '@/components/articles/ArticleNotFound';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();

  switch (id) {
    case 'natural-disasters':
      return <NaturalDisastersArticle />;
    case 'earthquake-3countries':
      return <EarthquakeThreeCountriesArticle />;
    case 'disaster-20years':
      return <DisasterTwentyYearsArticle />;
    default:
      return <ArticleNotFound />;
  }
};

export default ArticleDetail;
