import { GridFilterForm, GridLogicOperator, GridPanelContent, GridPanelFooter, GridPanelWrapper, gridFilterModelSelector, gridFilterableColumnDefinitionsSelector, useGridApiContext, useGridRootProps, useGridSelector } from '@mui/x-data-grid';
import { getGridFilter } from '@mui/x-data-grid/internals';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';

export const CustomDataGridPanel = forwardRef(
  function GridFilterPanel(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const lastFilterRef = useRef(null);
    const placeholderFilter = useRef(null);

    const {
      logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
      columnsSort,
      filterFormProps,
      getColumnForNewFilter,
      children,
      disableAddFilterButton = false,
      disableRemoveAllButton = false,
      ...other
    } = props;

    const applyFilter = useCallback(
      (item) => {
        apiRef.current.upsertFilterItem(item);
      },
      [apiRef],
    );

    const applyFilterLogicOperator = useCallback(
      (operator) => {
        apiRef.current.setFilterLogicOperator(operator);
      },
      [apiRef],
    );

    const getDefaultFilter = useCallback(() => {
      let nextColumnWithOperator;
      if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
        // To allow override the column for default (first) filter
        const nextFieldName = getColumnForNewFilter({
          currentFilters: filterModel?.items || [],
          columns: filterableColumns,
        });

        if (nextFieldName === null) {
          return null;
        }

        nextColumnWithOperator = filterableColumns.find(({ field }) => field === nextFieldName);
      } else {
        nextColumnWithOperator = filterableColumns.find((colDef) => colDef.filterOperators?.length);
      }

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel?.items, filterableColumns, getColumnForNewFilter]);

    const getNewFilter = useCallback(() => {
      if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
        return getDefaultFilter();
      }

      const currentFilters = filterModel.items.length
        ? filterModel.items
        : [getDefaultFilter()].filter(Boolean);

      // If no items are there in filterModel, we have to pass defaultFilter
      const nextColumnFieldName = getColumnForNewFilter({
        currentFilters: currentFilters,
        columns: filterableColumns,
      });

      if (nextColumnFieldName === null) {
        return null;
      }

      const nextColumnWithOperator = filterableColumns.find(
        ({ field }) => field === nextColumnFieldName,
      );

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);

    const items = useMemo(() => {
      if (filterModel.items.length) {
        return filterModel.items;
      }

      if (!placeholderFilter.current) {
        placeholderFilter.current = getDefaultFilter();
      }

      return placeholderFilter.current ? [placeholderFilter.current] : [];
    }, [filterModel.items, getDefaultFilter]);

    const hasMultipleFilters = items.length > 1;

    const addNewFilter = () => {
      const newFilter = getNewFilter();
      if (!newFilter) {
        return;
      }
      apiRef.current.upsertFilterItems([...items, newFilter]);
    };

    const deleteFilter = useCallback(
      (item) => {
        const shouldCloseFilterPanel = items.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
          apiRef.current.hideFilterPanel();
        }
      },
      [apiRef, items.length],
    );

    const handleRemoveAll = () => {
      if (items.length === 1 && items[0].value === undefined) {
        apiRef.current.deleteFilterItem(items[0]);
        apiRef.current.hideFilterPanel();
      }
      apiRef.current.setFilterModel({ ...filterModel, items: [] });
    };

    useEffect(() => {
      if (
        logicOperators.length > 0 &&
        filterModel.logicOperator &&
        !logicOperators.includes(filterModel.logicOperator)
      ) {
        applyFilterLogicOperator(logicOperators[0]);
      }
    }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);

    useEffect(() => {
      if (items.length > 0) {
        lastFilterRef.current?.focus();
      }
    }, [items.length]);

    return (
      <GridPanelWrapper ref={ref} {...other}>
        <GridPanelContent>
          {items.map((item, index) => (
            <GridFilterForm
              key={item.id == null ? index : item.id}
              item={item}
              applyFilterChanges={applyFilter}
              deleteFilter={deleteFilter}
              hasMultipleFilters={hasMultipleFilters}
              showMultiFilterOperators={index > 0}
              multiFilterOperator={filterModel.logicOperator}
              disableMultiFilterOperator={index !== 1}
              applyMultiFilterOperatorChanges={applyFilterLogicOperator}
              focusElementRef={index === items.length - 1 ? lastFilterRef : null}
              logicOperators={logicOperators}
              columnsSort={columnsSort}
              {...filterFormProps}
            />
          ))}
        </GridPanelContent>
        {!rootProps.disableMultipleColumnsFiltering &&
          !(disableAddFilterButton && disableRemoveAllButton) ? (
          <GridPanelFooter>
            {!disableAddFilterButton ? (
              <rootProps.slots.baseButton
                onClick={addNewFilter}
                startIcon={<rootProps.slots.filterPanelAddIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelAddFilter')}
              </rootProps.slots.baseButton>
            ) : (
              <span />
            )}

            {!disableRemoveAllButton ? (
              <rootProps.slots.baseButton
                onClick={handleRemoveAll}
                startIcon={<rootProps.slots.filterPanelRemoveAllIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelRemoveAll')}
              </rootProps.slots.baseButton>
            ) : null}
          </GridPanelFooter>
        ) : null}
      </GridPanelWrapper>
    );
  },
);