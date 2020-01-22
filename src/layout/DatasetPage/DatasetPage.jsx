import React from 'react';
import moment from 'moment';
import upperFirst from 'lodash/upperFirst';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import RawHTML from '../../components/RawHTML/RawHTML';
import { useDataset, useJoinableDatasets } from '../../hooks/datasets';
import './DatasetPage.scss';

const formatDate = (date) => moment(date).format('MMMM DD, YYYY');

export default function DatasetPage({ match }) {
  const { datasetID } = match.params;
  const dataset = useDataset(datasetID);
  const joins = useJoinableDatasets(dataset);
  const resource = dataset?.resource;
  const pageViews = resource?.page_views;
  const classification = dataset?.classification;
  const domainMetadata = classification?.domain_metadata;
  const updatedAutomation = domainMetadata?.find(
    ({ key, value }) => key === 'Update_Automation' && value === 'No',
  )?.value;
  const updateFrequency = domainMetadata?.find(
    ({ key }) => key === 'Update_Update-Frequency',
  )?.value;

  const informationAgency = domainMetadata?.find(
    ({ key }) => key === 'Dataset-Information_Agency',
  )?.value;
  return (
    <Container fluid="true" className="dataset-page">
      {dataset ? (
        <Container fluid="true">
          <Row fluid="true" className="dataset-header">
            <h1>Dataset: {resource?.name}</h1>
            <Col>
              <RawHTML
                className="dataset-description"
                html={resource?.description}
              />
            </Col>
          </Row>
          <Row fluid="true">
            <Col fluid="true">
              <Row fluid="true">
                <Container fluid="true">
                  <Row fluid="true">
                    <Col>
                      <dt>Updated</dt>
                      <dd>{formatDate(resource?.updatedAt)}</dd>
                    </Col>
                  </Row>
                  <Row fluid="true">
                    <Col>
                      <dt>Data Last Updated</dt>
                      <dd>{formatDate(resource?.updatedAt)}</dd>
                    </Col>
                    <Col>
                      <dt>Metadata Last Updated</dt>
                      <dd>{formatDate(resource?.metadata_updated_at)}</dd>
                    </Col>
                  </Row>
                  <Row fluid="true">
                    <Col>
                      <dt>Date Created</dt>
                      <dd>{formatDate(resource?.createdAt)}</dd>
                    </Col>
                  </Row>
                </Container>
              </Row>
              <Row fluid="true">
                {pageViews?.page_views_total ? (
                  <Col>
                    <dt>Views</dt>
                    <dd>{pageViews?.page_views_total}</dd>
                  </Col>
                ) : null}
                {dataset?.resource?.download_count ? (
                  <Col>
                    <dt>Downloads</dt>
                    <dd>{dataset?.resource?.download_count}</dd>
                  </Col>
                ) : null}
              </Row>
              <Row fluid="true">
                <Col>
                  <dt>Dataset Owner</dt>
                  <dd>{dataset?.owner?.display_name}</dd>
                </Col>
                <Col>
                  <dt>Columns</dt>
                  <dd>
                    <ul>
                      {dataset?.resource?.columns_name?.map((name, index) => (
                        <li key={index}>
                          {name} : {dataset?.resource?.columns_datatype[index]}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <h3>Update Information</h3>
                <Table striped borderless>
                  <tbody>
                    {updateFrequency ? (
                      <tr>
                        <td>Update Frequency</td>
                        <td>
                          <span>{updateFrequency}</span>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>Automation</td>
                      <td>
                        <span>
                          {updatedAutomation !== 'Yes' ? 'No' : 'Yes'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Date Made Public</td>
                      <td>
                        <span>
                          {formatDate(dataset?.resource?.publication_date)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h3>Dataset Information</h3>
                <Table striped borderless>
                  <tbody>
                    {informationAgency ? (
                      <tr>
                        <td>Agency</td>
                        <td>
                          <span>{informationAgency}</span>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h3>Topics</h3>
                <Table striped borderless>
                  <tbody>
                    <tr>
                      <td>Category</td>
                      <td>
                        {classification?.domain_category ? (
                          upperFirst(classification?.domain_category)
                        ) : (
                          <span className="italics">
                            This dataset does not have a category
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Tags</td>
                      <td>
                        {classification?.domain_tags?.length ? (
                          classification?.domain_tags
                            ?.map((category) => upperFirst(category))
                            .join(', ')
                        ) : (
                          <span className="italics">
                            This dataset does not have any tags
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
              <Row fluid="true">
                <div className="dataset-joins">
                  <h3>Can be joined with</h3>
                  <ul style={{ overflowY: 'auto' }}>
                    {joins.map((j, i) => (
                      <li key={i}>
                        <p>
                          <Link to={`/dataset/${j.resource?.id}`}>
                            {j.resource?.name}{' '}
                          </Link>{' '}
                          on :
                        </p>
                        <p> {j.joinableColumns.join(', ')}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      ) : (
        <h1>Loading...</h1>
      )}
    </Container>
  );
}
