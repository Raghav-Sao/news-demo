import React from 'react';
import Image from 'next/image';
import { Article } from '../types/article';
import { formatDate } from '../utils/dateFormatter';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const smallThumbnail = article.media[0]?.['media-metadata']?.find(
    (meta) => meta.format === 'mediumThreeByTwo210'
  );

  const largeThumbnail = article.media[0]?.['media-metadata']?.find(
    (meta) => meta.format === 'mediumThreeByTwo440'
  );

  return (
    <div
      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={onClick}
      data-testid="article-card"
    >
      {(smallThumbnail || largeThumbnail) && (
        <div className="flex-shrink-0">
          <div className="hidden md:block">
            {smallThumbnail && (
              <Image
                src={smallThumbnail.url}
                alt={article.title}
                width={smallThumbnail.width}
                height={smallThumbnail.height}
                className="rounded-md w-full"
              />
            )}
          </div>
          <div className="md:hidden">
            {largeThumbnail && (
              <Image
                src={largeThumbnail.url}
                alt={article.title}
                width={largeThumbnail.width}
                height={largeThumbnail.height}
                className="rounded-md w-full"
              />
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-2">{article.abstract}</p>
        <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
          <span>{article.byline}</span>
          <span>{formatDate(article.published_date)}</span>
        </div>
      </div>
    </div>
  );
}; 