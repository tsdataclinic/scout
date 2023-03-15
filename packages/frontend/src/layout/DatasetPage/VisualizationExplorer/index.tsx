import { useQuery } from 'react-query';
import { getFullDataset } from '../../../utils/socrata';
import socrataResultsToDataframe from './socrataResultsToDataframe';
import type { Dataset, ParsedCSVResults } from './socrataResultsToDataframe';
import * as DX from '../../../components/common/DataExplorer';

type Props = { dataset: Dataset };

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
      {dataframe ? <DX.Table dataframe={dataframe} /> : null}
    </div>
  );
}
