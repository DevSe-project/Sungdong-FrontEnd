import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxDisplayedPages = 10; // 최대 표시할 페이지 수

  const startPage = Math.floor((currentPage - 1) / maxDisplayedPages) * maxDisplayedPages + 1;
  const endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);

  return (
    <div className="buttonContainer">
      {/* 페이지네이션을 화면에 표시 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => index + 1).map(pageNumber => (
        <span
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={pageNumber == currentPage ? "onPageButton" : "offPageButton"}
        >
          {pageNumber}
        </span>
      ))}
      {/* 10페이지를 넘어가면 다음 화살표 버튼 */}
      {endPage < totalPages && (
        <span
          onClick={() => onPageChange(currentPage + 1)}
          className="nextPageButton"
        >
          <i className="far fa-angle-right" />
        </span>
      )}
    </div>
  );
};

export default Pagination;
