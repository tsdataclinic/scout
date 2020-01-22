import React, { useState, useMemo, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function usePagination(data, perPage = 20) {
  const items = useMemo(() => data.length, [data]);
  const [currentPageNo, setCurrentPageNo] = useState(0);

  useEffect(() => {
    setCurrentPageNo(0);
  }, [data]);

  const pages = Math.ceil(items / perPage);

  const pageButtons = (
    <ReactPaginate
      previousLabel="previous"
      nextLabel="next"
      breakLabel="..."
      breakClassName="break-me"
      pageCount={pages.length}
      onPageChange={({ selected: page }) => {
        setCurrentPageNo(page);
      }}
      containerClassName="pagination"
      subContainerClassName="pages pagination"
      activeClassName="active"
    />
  );

  const content = useMemo(
    () => data.slice(currentPageNo * perPage, (currentPageNo + 1) * perPage),
    [perPage, currentPageNo, data],
  );

  return [
    content,
    {
      pageButtons,
    },
  ];
}
