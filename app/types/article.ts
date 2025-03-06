export interface Article {
  uri: string;
  url: string;
  id: number;
  asset_id: number;
  source: string;
  published_date: string;
  updated: string;
  section: string;
  subsection: string;
  nytdsection: string;
  adx_keywords: string;
  column: string | null;
  byline: string;
  type: string;
  title: string;
  abstract: string;
  media: Array<{
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
    approved_for_syndication: number;
    'media-metadata': Array<{
      url: string;
      format: string;
      height: number;
      width: number;
    }>;
  }>;
}

export interface ArticleResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: Article[];
} 