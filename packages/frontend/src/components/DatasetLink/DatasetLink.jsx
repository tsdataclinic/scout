import { Link } from 'react-router-dom';

export default function DatasetLink({ dataset, className, children }) {
  const { portal } = dataset;
  return (
    <Link
      className={className}
      to={`/explore/${portal.abbreviation}/dataset/${dataset.id}/joins`}
    >
      {children}
    </Link>
  );
}
