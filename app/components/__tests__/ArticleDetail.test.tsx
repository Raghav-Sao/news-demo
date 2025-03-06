import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ArticleDetail } from '../ArticleDetail';

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

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}));

describe('ArticleDetail', () => {
  it('renders article details correctly', () => {
    const handleClose = jest.fn();
    const { getByText, getAllByAltText } = render(
      <ArticleDetail article={mockArticle} onClose={handleClose} />
    );

    expect(getByText('Test Article')).toBeInTheDocument();
    expect(getByText('This is a test article')).toBeInTheDocument();
    expect(getByText('By John Doe')).toBeInTheDocument();
    expect(getByText('March 6, 2024')).toBeInTheDocument();
    expect(getByText('Section:')).toBeInTheDocument();
    expect(getByText('Technology')).toBeInTheDocument();
    expect(getByText('Subsection:')).toBeInTheDocument();
    expect(getByText('Mobile')).toBeInTheDocument();
    expect(getByText('Keywords:')).toBeInTheDocument();
    expect(getByText('test,keywords')).toBeInTheDocument();
    const images = getAllByAltText('Test Article');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', mockArticle.media[0]['media-metadata'][0].url);
    expect(images[1]).toHaveAttribute('src', mockArticle.media[0]['media-metadata'][1].url);
    expect(getByText('Read Full Article')).toBeInTheDocument();
  });

  describe('Image handling', () => {
    it('renders both mobile and desktop images when available', () => {
      const handleClose = jest.fn();
      const { getAllByRole } = render(
        <ArticleDetail article={mockArticle} onClose={handleClose} />
      );
  
      const images = getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', mockArticle.media[0]['media-metadata'][0].url); // small image
      expect(images[1]).toHaveAttribute('src', mockArticle.media[0]['media-metadata'][1].url); // large image
      
      // Check classes for responsive display
      expect(images[0]).toHaveClass('md:hidden');
      expect(images[1]).toHaveClass('hidden', 'md:block');
    });
  
    it('uses fallback image when preferred formats are not available', () => {
      const handleClose = jest.fn();
      const fallbackUrl = 'https://example.com/fallback.jpg';
      const articleWithDifferentFormat = {
        ...mockArticle,
        media: [{
          ...mockArticle.media[0],
          'media-metadata': [{
            url: fallbackUrl,
            format: 'different-format',
            height: 200,
            width: 300,
          }]
        }]
      };
      
      const { getAllByRole } = render(
        <ArticleDetail article={articleWithDifferentFormat} onClose={handleClose} />
      );
  
      const images = getAllByRole('img');
      expect(images).toHaveLength(2);
      // Both images should use the fallback
      images.forEach(img => {
        expect(img).toHaveAttribute('src', fallbackUrl);
      });
    });
  
    it('renders without image when media array is empty', () => {
      const handleClose = jest.fn();
      const articleWithoutMedia = { ...mockArticle, media: [] };
      const { queryByRole } = render(
        <ArticleDetail article={articleWithoutMedia} onClose={handleClose} />
      );
  
      expect(queryByRole('img')).not.toBeInTheDocument();
    });
  
    it('renders without image when media-metadata is undefined', () => {
      const handleClose = jest.fn();
      const articleWithoutMetadata = {
        ...mockArticle,
        media: [{
          ...mockArticle.media[0],
          'media-metadata': undefined
        }]
      };
      
      const { queryByRole } = render(
        <ArticleDetail article={articleWithoutMetadata} onClose={handleClose} />
      );
  
      expect(queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders without image when media exists but has no media-metadata property', () => {
      const handleClose = jest.fn();
      const articleWithoutMetadataProperty = {
        ...mockArticle,
        media: [{
          type: 'image',
          subtype: 'photo',
          caption: 'Test Caption',
          copyright: '© 2024 NYT',
          approved_for_syndication: 1
          // media-metadata property is missing entirely
        }]
      };
      
      const { queryByRole } = render(
        <ArticleDetail article={articleWithoutMetadataProperty} onClose={handleClose} />
      );
  
      expect(queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      const { getByLabelText } = render(
        <ArticleDetail article={mockArticle} onClose={handleClose} />
      );
      const user = userEvent.setup();

      await user.click(getByLabelText('Close'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('closes popup when escape key is pressed', () => {
      const mockOnClose = jest.fn();
      render(
        <ArticleDetail
          article={mockArticle}
          onClose={mockOnClose}
        />
      );

      // Simulate pressing the Escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not close popup when other keys are pressed', () => {
      const mockOnClose = jest.fn();
      render(
        <ArticleDetail
          article={mockArticle}
          onClose={mockOnClose}
        />
      );

      // Simulate pressing a different key
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Optional content', () => {
    it('renders without subsection when not available', () => {
      const handleClose = jest.fn();
      const articleWithoutSubsection = { ...mockArticle, subsection: '' };
      const { queryByText } = render(
        <ArticleDetail article={articleWithoutSubsection} onClose={handleClose} />
      );

      expect(queryByText('Subsection:')).not.toBeInTheDocument();
    });
  });
}); 