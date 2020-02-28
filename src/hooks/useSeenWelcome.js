import { useEffect, useState } from 'react';

export default function useSeenWelcome() {
    const [seenWelcome, setSeenWelcome] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setSeenWelcome(window.localStorage.getItem('seenWelcome'));
        setLoaded(true);
    }, []);
    const aknowledgeSeenWelcome = () => {
        setSeenWelcome(true);
        window.localStorage.setItem('seenWelcome', true);
    };
    return [seenWelcome, loaded, aknowledgeSeenWelcome];
}
