import { useEffect } from 'react';

export default function usePageView(page, params) {
    useEffect(() => {
        const pageView = page || window.location.pathname;
        window.fathom('trackPageview', { path: pageView });
    }, [page]);
}
