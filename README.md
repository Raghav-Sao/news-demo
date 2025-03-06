# Most Popular Articles

A React application that displays the most popular articles from the NY Times API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- View most popular articles from the last 1, 7, or 30 days
- Responsive design with modern UI
- Article details modal with full information
- Unit tests with Jest and React Testing Library
- TypeScript for type safety
- Tailwind CSS for styling

## Prerequisites

- Node.js 18.x or later
- NPM 9.x or later
- NY Times API Key (get one at https://developer.nytimes.com/get-started)

## Installation

1. Clone the repository:
```bash
git clone [<repository-url>](https://github.com/Raghav-Sao/news-demo.git)
cd news-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your NY Times API key:
```bash
NEXT_PUBLIC_NY_TIMES_API_KEY=your_api_key_here
```

## Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

To run the test suite:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To generate test coverage report:

```bash
npm run test:coverage
```

## Project Structure

```
news-demo/
├── app/
│   ├── components/         # React components
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleDetail.tsx
│   │   └── __tests__/     # Component tests
│   ├── services/          # API services
│   ├── types/            # TypeScript types
│   └── page.tsx          # Main page component
├── public/               # Static files
└── README.md
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Jest](https://jestjs.io/) - Testing
- [React Testing Library](https://testing-library.com/react) - Component testing
- [Axios](https://axios-http.com/) - HTTP client

