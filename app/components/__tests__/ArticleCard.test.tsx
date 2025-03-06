import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ArticleCard } from '../ArticleCard';

const mockArticle = {
  uri: 'test-uri',
  url: 'https://example.com',
  id: 1,
  asset_id: 1,
  source: 'New York Times',
  published_date: '2024-03-06',
  updated: '2024-03-06',
  section: 'Technology',
  subsection: 'Mobile',
  nytdsection: 'technology',
  adx_keywords: 'test,keywords',
  column: null,
  byline: 'By John Doe',
  type: 'Article',
  title: 'Test Article',
  abstract: 'This is a test article',
  media: [
    {
      type: 'image',
      subtype: 'photo',
      caption: 'Test Caption',
      copyright: '© 2024 NYT',
      approved_for_syndication: 1,
      'media-metadata': [
        {
          url: 'https://example.com/small-image.jpg',
          format: 'mediumThreeByTwo210',
          height: 140,
          width: 210,
        },
        {
          url: 'https://example.com/large-image.jpg',
          format: 'mediumThreeByTwo440',
          height: 293,
          width: 440,
        },
      ],
    },
  ],
};

jest.mock('../../utils/dateFormatter', () => ({
  formatDate: () => 'March 6, 2024',
}));

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    const handleClick = jest.fn();
    const { getByText, getAllByAltText } = render(
      <ArticleCard article={mockArticle} onClick={handleClick} />
    );

    expect(getByText('Test Article')).toBeInTheDocument();
    expect(getByText('This is a test article')).toBeInTheDocument();
    expect(getByText('By John Doe')).toBeInTheDocument();
    expect(getByText('March 6, 2024')).toBeInTheDocument();
    
    // Both images should be in the DOM (one hidden, one visible)
    const images = getAllByAltText('Test Article');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('small-image.jpg'));
    expect(images[1]).toHaveAttribute('src', expect.stringContaining('large-image.jpg'));
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <ArticleCard article={mockArticle} onClick={handleClick} />
    );
    const user = userEvent.setup();

    await user.click(getByTestId('article-card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without images when media is not available', () => {
    const handleClick = jest.fn();
    const articleWithoutMedia = { ...mockArticle, media: [] };
    const { queryByRole } = render(
      <ArticleCard article={articleWithoutMedia} onClick={handleClick} />
    );

    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders with only small image when large image is not available', () => {
    const handleClick = jest.fn();
    const articleWithSmallImageOnly = {
      ...mockArticle,
      media: [{
        ...mockArticle.media[0],
        'media-metadata': [mockArticle.media[0]['media-metadata'][0]]
      }]
    };
    const { getAllByAltText } = render(
      <ArticleCard article={articleWithSmallImageOnly} onClick={handleClick} />
    );

    const images = getAllByAltText('Test Article');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('small-image.jpg'));
  });

  it('renders with only large image when small image is not available', () => {
    const handleClick = jest.fn();
    const articleWithLargeImageOnly = {
      ...mockArticle,
      media: [{
        ...mockArticle.media[0],
        'media-metadata': [mockArticle.media[0]['media-metadata'][1]]
      }]
    };
    const { getAllByAltText } = render(
      <ArticleCard article={articleWithLargeImageOnly} onClick={handleClick} />
    );

    const images = getAllByAltText('Test Article');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('large-image.jpg'));
  });
}); 