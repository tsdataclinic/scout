import React, { useState, useMemo, useEffect } from 'react';

export default function usePagination(data, perPage = 20) {
  const items = useMemo(() => data.length, [data]);
  const [currentPageNo, setCurrentPageNo] = useState(0);

  useEffect(() => {
    setCurrentPageNo(0);
  }, [data]);

  const pages = Math.ceil(items / perPage);

  const pageButtons = [...Array(pages)].map((_, page) => (
    /* eslint-disable */
    <span
      className={page === currentPageNo ? 'selected' : ''}
      onClick={() => setCurrentPageNo(page)}
    >
      {' '}
      {page + 1}{' '}
    </span>
    /* eslint-enable */
  ));

  const content = useMemo(
    () => data.slice(currentPageNo * perPage, (currentPageNo + 1) * perPage),
    [perPage, currentPageNo, data],
  );

  return [
    content,
    {
      pageButtons,
      setCurrentPageNo,
      currentPageNo,
    },
  ];
}
