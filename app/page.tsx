'use client';

import React, { useState, useEffect } from 'react';
import { Article } from './types/article';
import { getPopularArticles } from './services/articleService';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [period, setPeriod] = useState<1 | 7 | 30>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPopularArticles(period);
        setArticles(response.results);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [period]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          NY Times Most Popular Articles
        </h1>

        <div className="mb-6 flex justify-center space-x-4">
          {[1, 7, 30].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as 1 | 7 | 30)}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p} {p === 1 ? 'Day' : 'Days'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        )}

        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </div>
    </main>
  );
}
