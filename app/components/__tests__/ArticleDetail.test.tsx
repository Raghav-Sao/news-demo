import React from 'react';
import { render } from '@testing-library/react';
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
          url: 'https://example.com/image.jpg',
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

describe('ArticleDetail', () => {
  it('renders article details correctly', () => {
    const handleClose = jest.fn();
    const { getByText, getByAltText } = render(
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
    expect(getByAltText('Test Article')).toBeInTheDocument();
    expect(getByText('Read Full Article')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const { getByLabelText } = render(
      <ArticleDetail article={mockArticle} onClose={handleClose} />
    );
    const user = userEvent.setup();

    await user.click(getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders without image when media is not available', () => {
    const handleClose = jest.fn();
    const articleWithoutMedia = { ...mockArticle, media: [] };
    const { queryByRole } = render(
      <ArticleDetail article={articleWithoutMedia} onClose={handleClose} />
    );

    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders without subsection when not available', () => {
    const handleClose = jest.fn();
    const articleWithoutSubsection = { ...mockArticle, subsection: '' };
    const { queryByText } = render(
      <ArticleDetail article={articleWithoutSubsection} onClose={handleClose} />
    );

    expect(queryByText('Subsection:')).not.toBeInTheDocument();
  });
}); 