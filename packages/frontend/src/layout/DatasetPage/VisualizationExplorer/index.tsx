import * as React from 'react';
import { useQuery } from 'react-query';
import { getFullDataset } from '../../../utils/socrata';
import socrataResultsToDataframe from './socrataResultsToDataframe';
import type { Dataset, ParsedCSVResults } from './socrataResultsToDataframe';
import * as DX from '../../../components/common/DataExplorer';
import Select, { type SelectOption } from '../../../components/ui/Select';
import assertUnreachable from '../../../utils/assertUnreachable';

type Props = { dataset: Dataset };

const VIZ_OPTIONS: ReadonlyArray<SelectOption<DX.VizType>> = [
  {
    displayValue: 'Table',
    value: 'table',
  },
  {
    displayValue: 'Bar Chart',
    value: 'bars',
  },
  // TODO: add scatterplot back once it's ready
  /*
  {
    displayValue: 'Scatterplot',
    value: 'scatterplot',
  },
  */
  {
    displayValue: 'Map',
    value: 'map',
  },
];

export default function VisualizationExplorer({ dataset }: Props): JSX.Element {
  const [selectedViz, setSelectedViz] = React.useState<DX.VizType>('table');

  const { data: dataframe, isLoading } = useQuery(
    ['datasetResults', dataset?.id],
    async (): Promise<DX.Dataframe> => {
      if (dataset) {
        const { id: datasetId, portal } = dataset;
        const parsedCSVResults = (await getFullDataset(
          datasetId,
          portal.id,
        )) as ParsedCSVResults;
        return socrataResultsToDataframe(dataset, parsedCSVResults);
      }
      return {
        id: 'empty-dataframe',
        name: 'Empty Dataframe',
        data: [],
        fields: [],
      };
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const renderVisualization = (): JSX.Element => {
    if (dataframe) {
      switch (selectedViz) {
        case 'table':
          return <DX.Table dataframe={dataframe} />;
        case 'bars':
          return <DX.BarChart dataframe={dataframe} />;
        case 'scatterplot':
          return (
            <p>
              This visualization is under construction and not yet available.
            </p>
          );
        case 'map':
          return <DX.MapViz dataframe={dataframe} />;
        default:
          return assertUnreachable(selectedViz);
      }
    }

    return (
      <p>{isLoading ? 'Loading...' : 'An error occurred loading the data'}</p>
    );
  };

  return (
    <div className="h-full">
      {dataframe ? (
        <div className="space-y-4 h-full">
          <Select
            options={VIZ_OPTIONS}
            value={selectedViz}
            onChange={setSelectedViz}
          />
          {renderVisualization()}
        </div>
      ) : null}
    </div>
  );
}
