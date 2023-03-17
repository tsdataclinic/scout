import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import * as React from 'react';
import { ColDef, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { Dataframe } from './types';

// re-export some useful types from ag-grid library
export type { ColDef } from 'ag-grid-community';
export type { RowSelectedEvent } from 'ag-grid-community';
export type { AgGridReact } from 'ag-grid-react';

export interface CellRendererProps<T> {
  data: T;
  value: string;
}

type Props = {
  defaultColDef?: ColDef;
  height?: string | number;
  onRowSelected?: (event: RowSelectedEvent) => void;
  dataframe: Dataframe;
  rowSelection?: 'single' | 'multiple';
  width?: string | number;
  sizeColumnsToFit?: boolean;
};

function BaseTable(
  {
    dataframe,
    rowSelection,
    onRowSelected,
    width = '100%',
    defaultColDef = { filter: true, sortable: true },
    height = 650,
    sizeColumnsToFit = false,
  }: Props,
  ref: React.Ref<AgGridReact>,
): JSX.Element {
  const { fields, data } = dataframe;

  const mutableColDefs = React.useMemo(
    () =>
      fields.map(field => ({
        field: field.id,
        headerName: field.displayName,
        resizable: true,
      })),
    [fields],
  );

  const mutableRowData = React.useMemo(() => data.slice(), [data]);

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height, width }}>
        <AgGridReact
          ref={ref}
          pagination
          animateRows
          rowData={mutableRowData}
          columnDefs={mutableColDefs}
          defaultColDef={defaultColDef}
          onFirstDataRendered={(e: GridReadyEvent) => {
            if (sizeColumnsToFit) {
              e.api.sizeColumnsToFit();
            }
          }}
          rowSelection={rowSelection}
          onRowSelected={onRowSelected}
        />
      </div>
    </div>
  );
}

export const Table = React.forwardRef<AgGridReact, Props>(BaseTable);
