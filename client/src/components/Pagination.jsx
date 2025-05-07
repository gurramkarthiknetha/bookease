import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  showFirstLast = true,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    if (currentPage > 3 && showFirstLast) {
      pageNumbers.push(1);
      if (currentPage > 4) {
        pageNumbers.push('...');
      }
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - 2 && showFirstLast) {
      if (currentPage < totalPages - 3) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Determine button size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-2 text-base'
  };
  
  const buttonClass = sizeClasses[size] || sizeClasses.medium;

  // Base button styles
  const baseButtonClass = `${buttonClass} font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  
  // Active button styles
  const activeButtonClass = `${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`;
  
  // Inactive button styles
  const inactiveButtonClass = `${baseButtonClass} bg-white text-gray-700 hover:bg-gray-50 border border-gray-300`;
  
  // Disabled button styles
  const disabledButtonClass = `${baseButtonClass} bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300`;

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? disabledButtonClass : inactiveButtonClass}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      
      {/* Page numbers */}
      {showPageNumbers && getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={page === currentPage ? activeButtonClass : inactiveButtonClass}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
