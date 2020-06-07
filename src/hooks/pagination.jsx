import React, { useState, useMemo, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function usePagination({ perPage = 20, totalCount }) {
  const [currentPageNo, setCurrentPageNo] = useState(0);
  const pages = Math.ceil(totalCount / perPage);
  useEffect(() => {
    setCurrentPageNo(0);
  }, [perPage, totalCount]);

  const pageButtons = (
    <nav>
      <ReactPaginate
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={pages}
        onPageChange={({ selected: page }) => {
          setCurrentPageNo(page);
        }}
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        activeClassName="active"
        previousClassName="page-item"
        nextClassName="page-item"
        pageClassName="page-item"
      />
    </nav>
  );

  return [
    currentPageNo,
    {
      pageButtons,
    },
  ];
}
