import { useCallback, useEffect, useState, useMemo } from 'react';
import { usePagination } from '../../hooks/pagination';
import { useDepartmentsGQL } from '../../hooks/graphQLAPI';
import MultiSelector from '../MultiSelector/MultiSelector';
import { useSelectedDepartments } from '../../hooks/search';

type Props = {
  portalId: string;
  isGlobal: boolean;
};

const NUM_ITEMS_PER_PAGE = 20;

export default function DepartmentSelector({
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

  const [selectedDepartments, setSelectedCategories] = useSelectedDepartments();
  const { loading, data } = useDepartmentsGQL(portalId, {
    isGlobal,
    limit: NUM_ITEMS_PER_PAGE,
    page: pageNumber,
    search: searchTerm,
  });

  useEffect(() => {
    if (data) {
      setTotalCount(data.portal.uniqueDepartments.total);
    }
  }, [data]);

  const transformedItems = useMemo(() => {
    const pagedItems = data ? data.portal.uniqueDepartments.items : [];
    return pagedItems.map(
      (item: { department: string; occurrences: number }) => ({
        value: item.department,
        occurrences: item.occurrences,
      }),
    );
  }, [data]);

  return (
    <MultiSelector
      isCollapsed={isCollapsed}
      onCollapseToggle={onCollapseToggle}
      title="Departments"
      items={transformedItems}
      isLoading={loading}
      pageButtons={pageButtons}
      selectedItems={selectedDepartments}
      onItemSelectionChange={setSelectedCategories}
      onSearchTermChange={setSearchTerm}
      searchTerm={searchTerm}
    />
  );
}
