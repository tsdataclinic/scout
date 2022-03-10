import { useCallback, useEffect, useState, useMemo } from 'react';
import { usePagination } from '../../hooks/pagination';
import { useCategoriesGQL } from '../../hooks/graphQLAPI';
import MultiSelector from '../MultiSelector/MultiSelector';
import { useSelectedCategories } from '../../hooks/search';

type Props = {
  portalId: string;
};

const NUM_ITEMS_PER_PAGE = 20;

export default function CategoriesSelector({ portalId }: Props): JSX.Element {
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

  const [selectedCategories, setSelectedCategories] = useSelectedCategories();
  const { loading, data } = useCategoriesGQL(portalId, {
    limit: NUM_ITEMS_PER_PAGE,
    page: pageNumber,
    search: searchTerm,
  });

  useEffect(() => {
    if (data) {
      setTotalCount(data.portal.uniqueCategories.total);
    }
  }, [data]);

  const transformedItems = useMemo(() => {
    const pagedItems = data ? data.portal.uniqueCategories.items : [];
    return pagedItems.map(
      (item: { category: string; occurrences: number }) => ({
        value: item.category,
        occurrences: item.occurrences,
      }),
    );
  }, [data]);

  return (
    <MultiSelector
      sentenceCase
      title="Categories"
      isCollapsed={isCollapsed}
      onCollapseToggle={onCollapseToggle}
      items={transformedItems}
      isLoading={loading}
      pageButtons={pageButtons}
      selectedItems={selectedCategories}
      onItemSelectionChange={setSelectedCategories}
      onSearchTermChange={setSearchTerm}
      searchTerm={searchTerm}
    />
  );
}
