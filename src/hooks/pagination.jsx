import React, { useState, useMemo, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export default function usePagination(data, perPage = 20) {
  const pages = useMemo(() => Math.ceil(data.length / perPage), [
    data,
    perPage,
  ]);
  const [currentPageNo, setCurrentPageNo] = useState(0);

  useEffect(() => {
    setCurrentPageNo(0);
  }, [data]);

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

  // This wouldnt trigger on changes to data order without the data[0] need to
  // find a better solution to this going forward
  const content = useMemo(
    () => data.slice(currentPageNo * perPage, (currentPageNo + 1) * perPage),
    [perPage, currentPageNo, data, data[0]],
  );

  return [
    content,
    {
      pageButtons,
    },
  ];
}
