export default function getDatasetURL(dataset: {
  id: string;
  portal: {
    abbreviation: string;
  };
}): string {
  return `/explore/${dataset.portal.abbreviation}/dataset/${dataset.id}`;
}
