import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
    <div className="buttonContainer">
    {/* 페이지네이션을 화면에 표시 */}
    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
        <span
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={pageNumber == currentPage ? "onPageButton" : "offPageButton"}
        >
        {pageNumber}
        </span>
    ))}
    </div>
    );
};

export default Pagination;
