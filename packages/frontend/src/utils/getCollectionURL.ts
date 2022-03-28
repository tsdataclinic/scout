export default function getCollectionURL(
  collection:
    | string
    | {
        id: string;
      },
): string {
  return `/collection/${
    typeof collection === 'string' ? collection : collection.id
  }`;
}
