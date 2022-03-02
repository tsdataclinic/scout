import './CollectionCard.scss';
import { formatDate } from '../../utils/formatters';

export default function CollectionCard({ collection }) {
  return (
    <div className="collection-card">
      <p className="created-at">
        Collection created {formatDate(collection.createdAt)}
      </p>
      <h3>{collection.name}</h3>
      <div className="collection-stats">
        <span>
          Datasets: {collection.datasetIDs ? collection.datasetIDs.length : 0}
        </span>
      </div>
    </div>
  );
}
