import * as R from 'remeda';
import assertUnreachable from '../../../utils/assertUnreachable';
import * as DX from '../../../components/common/DataExplorer';

type DatasetColumnType =
  | 'Calendar date'
  | 'Checkbox'
  | 'Date'
  | 'Geospatial'
  | 'Location'
  | 'MultiLine'
  | 'MultiPoint'
  | 'MultiPolygon'
  | 'Number'
  | 'Photo'
  | 'Point'
  | 'Polygon'
  | 'Text'
  | 'URL';

export type Dataset = {
  createdAt: string;
  datasetColumns: ReadonlyArray<{
    id: string;
    name: string;
    field: string;
    type: DatasetColumnType;
  }>;
  department: string;
  description: string;
  id: string;
  name: string;
  permalink: string;
  portal: {
    abbreviation: string;
    baseURL: string;
    id: string;
    logo: string;
    name: string;
  };
  updateFrequency: string;
  updatedAt: string;
  views: number;
};

export type ParsedCSVResults = {
  data: Array<Record<string, string | null | undefined>>;
  errors: Array<{
    code: string;
    message: string;
    row: number;
    type: string;
  }>;
  meta?: {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    fields: string[];
    linebreak: string;
    truncated: boolean;
  };
};

/**
 * The DatasetColumns might have many different types of data types, based
 * on how they're stored in socrata. We want to convert all of those different
 * types to a known set of base type that we can use within visualizations.
 */
function socrataFieldTypeToVizFieldType(type: DatasetColumnType): DX.FieldType {
  switch (type) {
    case 'Date':
    case 'Calendar date':
      return 'date';
    case 'Checkbox':
      return 'boolean';
    case 'Number':
      return 'number';
    case 'Photo':
    case 'Point':
    case 'Polygon':
    case 'Geospatial':
    case 'Location':
    case 'MultiLine':
    case 'MultiPoint':
    case 'MultiPolygon':
    case 'Text':
      return 'text';
    case 'URL':
      return 'url';
    default:
      assertUnreachable(type, { throwError: false });
      return 'text';
  }
}

export default function socrataResultsToDataframe(
  dataset: Dataset,
  parsedSocrataCSV: ParsedCSVResults,
): DX.Dataframe {
  // first remove any rows with errors
  const rowsWithErrors = new Set(
    parsedSocrataCSV.errors.map(error => error.row),
  );
  const rawRows = parsedSocrataCSV.data.filter(
    (_, i) => !rowsWithErrors.has(i),
  );

  // now get all column configurations and generate the field objects
  const { datasetColumns } = dataset;
  const datasetColumnsMap = new Map(
    datasetColumns.map(col => [col.field, col]),
  );

  const fields =
    parsedSocrataCSV.meta?.fields.map(field => {
      const datasetColumn = datasetColumnsMap.get(field);
      if (datasetColumn) {
        return {
          id: field,
          type: socrataFieldTypeToVizFieldType(datasetColumn.type),
          displayName: datasetColumn.name,
        };
      }

      // if we could not find a DatasetColumn configuration then default it
      // to 'text' type
      return { id: field, type: 'text' as const, displayName: field };
    }) ?? [];

  // Now that we have field configurations, process the rows into their
  // correct datatypes
  const fieldsMap = new Map(fields.map(field => [field.id, field]));

  const transformedRows = rawRows.map(rawRow => {
    const newRow = R.mapValues(
      rawRow,
      (rowValue: DX.RowValue, fieldId: string) => {
        const field = fieldsMap.get(fieldId);
        if (field) {
          switch (field.type) {
            case 'text':
              return rowValue;
            case 'date':
              return new Date(String(rowValue));
            case 'url':
              return rowValue;
            case 'number':
              return Number(rowValue);
            case 'boolean':
              return Boolean(rowValue);
            default:
              return assertUnreachable(field.type);
          }
        }
        return rowValue;
      },
    );

    return newRow;
  });

  return {
    fields,
    id: dataset.id,
    name: dataset.name,
    data: transformedRows,
    city: dataset.portal.abbreviation,
  };
}
