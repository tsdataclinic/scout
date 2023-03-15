import { useQuery } from 'react-query';
import { getFullDataset } from '../../../utils/socrata';
import socrataResultsToDataframe from './socrataResultsToDataframe';
import type { Dataset, ParsedCSVResults } from './socrataResultsToDataframe';
import * as DX from '../../../components/common/DataExplorer';
import Select, { type SelectOption } from '../../../components/ui/Select';

type Props = { dataset: Dataset };

const VIZ_OPTIONS: ReadonlyArray<SelectOption<DX.VizType>> = [
  {
    displayValue: 'Table',
    value: 'table',
  },
  {
    displayValue: 'Histogram',
    value: 'histogram',
  },
  {
    displayValue: 'Scatterplot',
    value: 'scatterplot',
  },
  {
    displayValue: 'Map',
    value: 'map',
  },
];

export default function VisualizationExplorer({ dataset }: Props): JSX.Element {
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
  );

  return (
    <div>
      {isLoading ? 'Loading...' : null}
      {dataframe ? (
        <div className="space-y-4">
          <Select options={VIZ_OPTIONS} defaultValue="table" />
          <DX.Table dataframe={dataframe} />
        </div>
      ) : null}
    </div>
  );
}
