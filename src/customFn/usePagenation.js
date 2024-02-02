import React from 'react';

const usePagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
    <div id="pagination-container">
    {/* 페이지네이션을 화면에 표시 */}
    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
        <span
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={pageNumber === currentPage ? 'current-page' : ''}
        >
        {pageNumber}
        </span>
    ))}
    </div>
    );
};

export default usePagination;
