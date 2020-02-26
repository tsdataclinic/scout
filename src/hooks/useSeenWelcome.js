import { useEffect, useState } from 'react';

export default function useSeenWelcome() {
  const [seenWelcome, setSeenWelcome] = useState(false);

  useEffect(
    () => setSeenWelcome(window.localStorage.getItem('seenWelcome')),
    [],
  );
  const aknowledgeSeenWelcome = () => {
    setSeenWelcome(true);
    window.localStorage.setItem('seenWelcome', true);
  };
  return [seenWelcome, aknowledgeSeenWelcome];
}
