import React, { useState, useMemo, useEffect } from 'react';
import ReactPaginate from 'react-paginate';


export function usePagenationWithItems(data, perPage = 20) {
  const pages = useMemo(() => Math.ceil(data.length / perPage), [
    data,
    perPage,
  ]);
  const [currentPageNo, setCurrentPageNo] = useState(0);

  useEffect(() => {
    setCurrentPageNo(0);
  }, [pages]);

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

  const content = data.slice(
    currentPageNo * perPage,
    (currentPageNo + 1) * perPage,
  );

  return [
    content,
    {
      pageButtons,
    },
  ];
}
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
