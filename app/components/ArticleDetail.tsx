import React, { useEffect } from 'react';
import Image from 'next/image';
import { Article } from '../types/article';
import { formatDate } from '../utils/dateFormatter';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const getImageMetadata = () => {
    const mediaMetadata = article.media[0]?.['media-metadata'];
    if (!mediaMetadata || mediaMetadata.length === 0) return null;

    // Try to find mediumThreeByTwo440 format first
    const preferredFormat = mediaMetadata.find(
      (meta) => meta.format === 'mediumThreeByTwo440'
    );

    // If preferred format is not found, use the first available image
    const imageToUse = preferredFormat || mediaMetadata[0];

    // Use the same image for both small and large displays
    return imageToUse ? {
      small: imageToUse,
      large: imageToUse
    } : null;
  };

  const imageMetadata = getImageMetadata();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {imageMetadata && (
            <div className="mb-4">
              <Image
                src={imageMetadata.small.url}
                alt={article.title}
                width={imageMetadata.small.width}
                height={imageMetadata.small.height}
                className="rounded-lg w-full md:hidden"
              />
              <Image
                src={imageMetadata.large.url}
                alt={article.title}
                width={imageMetadata.large.width}
                height={imageMetadata.large.height}
                className="rounded-lg w-full hidden md:block"
              />
            </div>
          )}

          <div className="mb-4 text-gray-600">
            <p className="font-semibold">{article.byline}</p>
            <p>{formatDate(article.published_date)}</p>
          </div>

          <p className="text-lg mb-4">{article.abstract}</p>

          <div className="space-y-2 text-gray-600">
            <p><span className="font-semibold">Section:</span> {article.section}</p>
            {article.subsection && (
              <p><span className="font-semibold">Subsection:</span> {article.subsection}</p>
            )}
            <p><span className="font-semibold">Keywords:</span> {article.adx_keywords}</p>
          </div>

          <div className="mt-6">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 