import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link, useParams } from 'react-router-dom';
import usePageView from '../../hooks/analytics';
import { useDataset, useJoinableDatasets } from '../../hooks/datasets';

export default function ComparisonPage() {
  const { datasetId } = useParams();
  const dataset = useDataset(datasetId);
  const joins = useJoinableDatasets(dataset);
  usePageView();
  return (
    <Container>
      {dataset ? (
        <>
          <Row>
            <h1>Dataset {dataset.resource.name}</h1>
            <p>{dataset.resource.description}</p>
          </Row>
          <Row>
            <h2>Columns</h2>
            <ul>
              {dataset.resource.columns_name.map((name, index) => (
                <li>
                  {name} : {dataset.resource.columns_datatype[index]}
                </li>
              ))}
            </ul>
          </Row>
          <div className="dataset-joins">
            <h2>Can be joined with</h2>
            <ul style={{ overflowY: 'auto' }}>
              {joins.map(j => (
                <li>
                  <p>
                    <Link to={`/dataset/${j.dataset.resource.id}`}>
                      {j.dataset.resource.name}{' '}
                    </Link>{' '}
                    on :
                  </p>
                  <p> {j.joinableColumns.join(', ')}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </Container>
  );
}
