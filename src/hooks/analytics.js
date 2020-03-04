import { useEffect } from 'react';
export default function usePageView(page, params) {
    useEffect(() => {
        let pageView = page ? page : window.location.pathname;
        window.fathom('trackPageview', { path: pageView });
    }, []);
}
