import { useQuery } from 'react-query';
import { getFullDataset } from '../../../utils/socrata';
import socrataResultsToDataframe from './socrataResultsToDataframe';
import type {
  VizDataframe,
  Dataset,
  ParsedCSVResults,
} from './socrataResultsToDataframe';

type Props = { dataset: Dataset };

export default function VisualizationExplorer({ dataset }: Props): JSX.Element {
  const { data: dataframe, isLoading } = useQuery(
    ['datasetResults', dataset?.id],
    async (): Promise<VizDataframe> => {
      if (dataset) {
        const { id: datasetId, portal } = dataset;
        const parsedCSVResults = (await getFullDataset(
          datasetId,
          portal.id,
        )) as ParsedCSVResults;
        return socrataResultsToDataframe(dataset, parsedCSVResults);
      }
      return {
        data: [],
        fields: [],
      };
    },
  );

  return (
    <div>
      {isLoading ? 'Loading...' : null}
      {dataframe ? <div>{dataframe.data.length}</div> : null}
    </div>
  );
}
