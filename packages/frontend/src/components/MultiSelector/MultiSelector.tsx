import classNames from 'classnames';
import FilterLoading from '../Loading/FilterLoading/FilterLoading';
import './MultiSelector.scss';

type FilterItem = {
  field: string;
  occurrences: number;
};

type Props = {
  isCollapsed: boolean;
  items: readonly FilterItem[];
  isLoading: boolean;
  onCollapseToggle: () => void;
  onItemSelectionChange: (selectedItems: readonly string[]) => void;
  onSearchTermChange: (searchTerm: string) => void;
  pageButtons: JSX.Element;
  searchTerm: string;
  selectedItems: readonly string[];
  title: string;
};

export default function MultiSelector({
  isCollapsed,
  items,
  isLoading,
  onCollapseToggle,
  onItemSelectionChange,
  onSearchTermChange,
  pageButtons,
  searchTerm,
  selectedItems,
  title,
}: Props): JSX.Element {
  const clearItems = (): void => {
    onItemSelectionChange([]);
  };
  const toggleItem = (itemField: string): void => {
    const newSelection = selectedItems.includes(itemField)
      ? selectedItems.filter(x => x !== itemField)
      : selectedItems.concat(itemField);
    onItemSelectionChange(newSelection);
  };

  return (
    <div className="mutli-selector">
      <h2>
        <button
          className="header-button"
          type="button"
          onClick={onCollapseToggle}
        >
          {title} <span> {isCollapsed ? '+' : '-'}</span>{' '}
        </button>
      </h2>

      {!isCollapsed && (
        <>
          <div className="search">
            <input
              disabled={isLoading}
              placeholder="filter"
              value={searchTerm}
              onChange={e => onSearchTermChange(e.target.value)}
              key="search"
            />
          </div>
          <ul className="multi-list">
            {isLoading ? (
              <FilterLoading />
            ) : (
              items.map((item: FilterItem) => (
                // TODO: remove this eslint-disable
                // eslint-disable-next-line
                <li
                  key={item.field}
                  onClick={() => toggleItem(item.field)}
                  className={classNames('multi-buttons', {
                    selected:
                      selectedItems && selectedItems.includes(item.field),
                  })}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedItems && selectedItems.includes(item.field)
                    }
                    className="checkbox"
                  />
                  <span className="item-name">{item.field}</span>
                  <span className="pill">{item.occurrences}</span>
                </li>
              ))
            )}
          </ul>
          {pageButtons}
          {selectedItems && selectedItems.length > 0 ? (
            <button type="button" onClick={clearItems}>
              clear
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
