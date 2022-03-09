import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '../../hooks/pagination';
import { useColumnsGQL } from '../../hooks/graphQLAPI';
import MultiSelector from '../MultiSelector/MultiSelector';
import { useSelectedColumns } from '../../hooks/search';

type Props = {
  portalId: string;
};

const NUM_ITEMS_PER_PAGE = 20;

export default function ColumnSelector({ portalId }: Props): JSX.Element {
  /*
  const [selectedCategories, setSelectedCategories] = useState<
    readonly string[]
  >([]);
  > */
  const [selectedColumns, setSelectedColumns] = useSelectedColumns();
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

  const { loading: isLoadingColumns, data: columnsResult } = useColumnsGQL(
    portalId,
    {
      limit: NUM_ITEMS_PER_PAGE,
      page: pageNumber,
      search: searchTerm,
    },
  );

  useEffect(() => {
    if (columnsResult) {
      setTotalCount(columnsResult.portal.uniqueColumnFields.total);
    }
  }, [columnsResult]);

  const pagedItems = columnsResult
    ? columnsResult.portal.uniqueColumnFields.items
    : [];

  return (
    <MultiSelector
      isCollapsed={isCollapsed}
      onCollapseToggle={onCollapseToggle}
      title="Columns"
      key="Columns"
      items={pagedItems}
      isLoading={isLoadingColumns}
      pageButtons={pageButtons}
      selectedItems={selectedColumns}
      onItemSelectionChange={setSelectedColumns}
      onSearchTermChange={setSearchTerm}
      searchTerm={searchTerm}
    />
  );
}
