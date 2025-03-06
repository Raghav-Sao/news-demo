import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ArticleCard } from '../ArticleCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}));

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
          url: 'https://example.com/small.jpg',
          format: 'Standard Thumbnail',
          height: 75,
          width: 75,
        },
        {
          url: 'https://example.com/large.jpg',
          format: 'mediumThreeByTwo440',
          height: 293,
          width: 440,
        }
      ],
    },
  ],
};

jest.mock('../../utils/dateFormatter', () => ({
  formatDate: () => 'March 6, 2024',
}));

describe('ArticleCard', () => {
  it('renders article card correctly', () => {
    const handleClick = jest.fn();
    const { getByText, getByAltText } = render(
      <ArticleCard article={mockArticle} onClick={handleClick} />
    );

    expect(getByText('Test Article')).toBeInTheDocument();
    expect(getByText('This is a test article')).toBeInTheDocument();
    expect(getByAltText('Test Article')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <ArticleCard article={mockArticle} onClick={handleClick} />
    );
    const user = userEvent.setup();

    const card = getByTestId('article-card');
    await user.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with correct images for different viewports', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <ArticleCard article={mockArticle} onClick={handleClick} />
    );

    // Check mobile image (md:hidden)
    const mobileImage = container.querySelector('.md\\:hidden img');
    expect(mobileImage).toHaveAttribute('src', mockArticle.media[0]['media-metadata'][1].url);
    expect(mobileImage).toHaveAttribute('alt', 'Test Article');

    // Check desktop image (hidden md:block)
    const desktopImageContainer = container.querySelector('.hidden.md\\:block');
    expect(desktopImageContainer).toBeInTheDocument();
  });

  it('uses fallback image when Standard Thumbnail format is not available', () => {
    const handleClick = jest.fn();
    const articleWithLargeImageOnly = {
      ...mockArticle,
      media: [{
        ...mockArticle.media[0],
        'media-metadata': [{
          url: 'https://example.com/large.jpg',
          format: 'mediumThreeByTwo440',
          height: 293,
          width: 440,
        }]
      }]
    };
    
    const { getByAltText } = render(
      <ArticleCard article={articleWithLargeImageOnly} onClick={handleClick} />
    );

    const image = getByAltText('Test Article');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/large.jpg');
  });

  it('renders without image when media is not available', () => {
    const handleClick = jest.fn();
    const articleWithoutMedia = { ...mockArticle, media: [] };
    const { queryByRole } = render(
      <ArticleCard article={articleWithoutMedia} onClick={handleClick} />
    );

    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders without image when media-metadata is undefined', () => {
    const handleClick = jest.fn();
    const articleWithoutMetadata = {
      ...mockArticle,
      media: [{
        ...mockArticle.media[0],
        'media-metadata': []
      }]
    };
    
    const { queryByRole } = render(
      <ArticleCard article={articleWithoutMetadata} onClick={handleClick} />
    );

    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders with only small thumbnail when large thumbnail is not available', () => {
    const handleClick = jest.fn();
    const articleWithSmallImageOnly = {
      ...mockArticle,
      media: [{
        ...mockArticle.media[0],
        'media-metadata': [{
          url: 'https://example.com/small.jpg',
          format: 'mediumThreeByTwo210',
          height: 75,
          width: 75,
        }]
      }]
    };
    
    const { container } = render(
      <ArticleCard article={articleWithSmallImageOnly} onClick={handleClick} />
    );

    // Check that only desktop image exists (small thumbnail)
    const desktopImage = container.querySelector('.hidden.md\\:block img');
    expect(desktopImage).toBeInTheDocument();
    expect(desktopImage).toHaveAttribute('src', 'https://example.com/small.jpg');

    // Check that mobile image container is empty
    const mobileImage = container.querySelector('.md\\:hidden img');
    expect(mobileImage).not.toBeInTheDocument();
  });
}); 