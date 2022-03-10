import classNames from 'classnames';
import FilterLoading from '../Loading/FilterLoading/FilterLoading';
import './MultiSelector.scss';

type FilterItem = {
  value: string;
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
  sentenceCase?: boolean;
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
  sentenceCase = false,
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
              placeholder="filter"
              value={searchTerm}
              onChange={e => onSearchTermChange(e.target.value)}
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
                  key={item.value}
                  onClick={() => toggleItem(item.value)}
                  className={classNames('multi-buttons', {
                    selected:
                      selectedItems && selectedItems.includes(item.value),
                  })}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedItems && selectedItems.includes(item.value)
                    }
                    className="checkbox"
                  />
                  <span
                    className="item-name"
                    style={{
                      textTransform: sentenceCase ? 'capitalize' : undefined,
                    }}
                  >
                    {item.value}
                  </span>
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
