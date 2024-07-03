import {
  IndexFilters,
  IndexFiltersProps,
  useSetIndexFiltersMode
} from "@shopify/polaris";

type TableFilters = {
  filterTabs?:  IndexFiltersProps['tabs'];
  queryPlaceholder?: string;
  primaryAction?: IndexFiltersProps['primaryAction'];
  onCancel: () => void
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  disabled?: boolean;
}

export function TableFilters ({filterTabs = [], queryPlaceholder, primaryAction, onCancel, setSearchQuery, searchQuery, disabled}: TableFilters) {
  const {mode, setMode} = useSetIndexFiltersMode();

  return (
    <IndexFilters
      queryValue={searchQuery}
      queryPlaceholder={queryPlaceholder}
      primaryAction={primaryAction}
      onQueryChange={(value: string) => setSearchQuery(value)}
      onQueryClear={() => setSearchQuery('')}
      tabs={filterTabs}
      filters={[]}
      mode={mode}
      setMode={setMode}
      canCreateNewView={false}
      onClearAll={() => {}}
      cancelAction={{
        onAction: onCancel,
      }}
      disabled={disabled}
    />
  )
}