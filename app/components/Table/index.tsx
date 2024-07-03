import {IndexTable, useIndexResourceState, Box, IndexFiltersProps,} from "@shopify/polaris";
import {TableFilters} from "~/components/TableFilters";
import { useEffect, useState} from "react";
import {
  IndexTableBaseProps,
  IndexTablePaginationProps, IndexTableSortDirection
} from "@shopify/polaris/build/ts/src/components/IndexTable/IndexTable";

type TableProps = {
  items: any[];
  rowMarkup: JSX.Element[];
  setSelectedItems?: (items: string[]) => void;
  resourceName: { singular: string; plural: string };
  sortable?: boolean[];
  pagination: IndexTablePaginationProps;
  bulkActions?: any;
  headings: IndexTableBaseProps['headings']
  filterTabs?: IndexFiltersProps['tabs'];
  queryPlaceholder?: string;
  filterPrimaryAction?: IndexFiltersProps['primaryAction']
  onCancel: () => void;
  onSort?: (headingIndex: number, direction: 'ascending' | 'descending') => void
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  disabled?: boolean;
  selectable?: boolean
}

export function Table({
                        items,
                        rowMarkup,
                        setSelectedItems,
                        resourceName,
                        sortable,
                        pagination,
                        bulkActions,
                        headings,
                        filterTabs,
                        queryPlaceholder,
                        filterPrimaryAction,
                        onCancel,
                        onSort,
                        searchQuery,
                        setSearchQuery,
                        disabled,
                        selectable
                      }: TableProps) {
  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(items);

  const [sortDirection, setSortDirection] = useState<IndexTableSortDirection>('ascending')

  useEffect(() => {
    if (setSelectedItems) {
      setSelectedItems(selectedResources)
    }

  }, [selectedResources]);


  return (
    <Box borderRadius="200" shadow="300" padding='050' background="bg-surface">
      <TableFilters
        filterTabs={filterTabs}
        queryPlaceholder={queryPlaceholder}
        primaryAction={filterPrimaryAction}
        onCancel={onCancel}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        disabled={disabled}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={items.length}
        sortable={sortable}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        promotedBulkActions={bulkActions}
        onSelectionChange={handleSelectionChange}
        headings={headings}
        pagination={pagination}
        sortDirection={sortDirection}
        onSort={(headingIndex) => {
          const direction = sortDirection === 'ascending' ? 'descending' : 'ascending'
          setSortDirection(direction)
          onSort && onSort(headingIndex, direction)
        }}
        loading={disabled}
        selectable={selectable}
      >
        {rowMarkup}

      </IndexTable>

    </Box>
  )
}
