import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookCard from '../../components/BookCard';

// Mock the heroicons
vi.mock('@heroicons/react/24/solid', () => ({
  StarIcon: () => <div data-testid="star-icon-solid" />
}));

vi.mock('@heroicons/react/24/outline', () => ({
  StarIcon: () => <div data-testid="star-icon-outline" />
}));

describe('BookCard Component', () => {
  const mockBook = {
    _id: '123',
    title: 'Test Book',
    author: 'Test Author',
    coverImage: 'https://example.com/cover.jpg',
    averageRating: 4.5,
    genre: ['Fiction', 'Fantasy', 'Adventure'],
    availabilityStatus: 'Available'
  };

  it('renders book information correctly', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    );

    // Check if book title and author are rendered
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    
    // Check if availability status is rendered
    expect(screen.getByText(mockBook.availabilityStatus)).toBeInTheDocument();
    
    // Check if genres are rendered (only 2 should be visible)
    expect(screen.getByText(mockBook.genre[0])).toBeInTheDocument();
    expect(screen.getByText(mockBook.genre[1])).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument(); // +1 for the third genre
    
    // Check if rating is rendered
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    
    // Check if the link to book details is correct
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/books/${mockBook._id}`);
    
    // Check if cover image is rendered
    const image = screen.getByAltText(mockBook.title);
    expect(image).toHaveAttribute('src', mockBook.coverImage);
  });

  it('renders default cover image when no cover is provided', () => {
    const bookWithoutCover = {
      ...mockBook,
      coverImage: null
    };

    render(
      <BrowserRouter>
        <BookCard book={bookWithoutCover} />
      </BrowserRouter>
    );

    const image = screen.getByAltText(bookWithoutCover.title);
    expect(image).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });

  it('renders correct availability status color', () => {
    // Test available status
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    );

    const availableStatus = screen.getByText('Available');
    expect(availableStatus).toHaveClass('bg-green-500');

    // Test unavailable status
    const unavailableBook = {
      ...mockBook,
      availabilityStatus: 'Unavailable'
    };

    render(
      <BrowserRouter>
        <BookCard book={unavailableBook} />
      </BrowserRouter>
    );

    const unavailableStatus = screen.getByText('Unavailable');
    expect(unavailableStatus).toHaveClass('bg-red-500');
  });
});
