import { useCallback, useEffect, useState, useMemo } from 'react';
import { usePagination } from '../../hooks/pagination';
import { useColumnsGQL } from '../../hooks/graphQLAPI';
import MultiSelector from '../MultiSelector/MultiSelector';
import { useSelectedColumns } from '../../hooks/search';

type Props = {
  portalId: string;
  isGlobal: boolean;
};

const NUM_ITEMS_PER_PAGE = 20;

export default function ColumnSelector({
  portalId,
  isGlobal,
}: Props): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, { pageButtons }] = usePagination({
    perPage: NUM_ITEMS_PER_PAGE,
    totalCount,
    invalidators: undefined,
  }) as [number, { pageButtons: JSX.Element }];

  const onCollapseToggle = useCallback(
    () => setIsCollapsed(prevCollapsed => !prevCollapsed),
    [],
  );

  const [selectedColumns, setSelectedColumns] = useSelectedColumns();

  const { loading, data } = useColumnsGQL(portalId, {
    isGlobal,
    limit: NUM_ITEMS_PER_PAGE,
    page: pageNumber,
    search: searchTerm,
  });

  useEffect(() => {
    if (data) {
      setTotalCount(data.portal.uniqueColumnFields.total);
    }
  }, [data]);

  const transformedItems = useMemo(() => {
    const pagedItems = data ? data.portal.uniqueColumnFields.items : [];
    return pagedItems.map((item: { field: string; occurrences: number }) => ({
      value: item.field,
      occurrences: item.occurrences,
    }));
  }, [data]);

  return (
    <MultiSelector
      title="Columns"
      isCollapsed={isCollapsed}
      onCollapseToggle={onCollapseToggle}
      items={transformedItems}
      isLoading={loading}
      pageButtons={pageButtons}
      selectedItems={selectedColumns}
      onItemSelectionChange={setSelectedColumns}
      onSearchTermChange={setSearchTerm}
      searchTerm={searchTerm}
    />
  );
}
