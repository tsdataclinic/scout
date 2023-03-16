export type FieldType = 'text' | 'date' | 'url' | 'number' | 'boolean';

export type RowValue = string | number | Date | boolean | null | undefined;
export type Row = { [fieldId: string]: RowValue };

export type Field = {
  id: string;
  type: FieldType;
  displayName: string;
};

export type Dataframe = {
  /** The id for this dataframe */
  id: string;

  /** The display name for this dataframe */
  name: string;

  /** all data rows */
  data: readonly Row[];

  /** The header fields of this dataframe */
  fields: readonly Field[];
};

export type VizType = 'table' | 'histogram' | 'scatterplot' | 'map';
