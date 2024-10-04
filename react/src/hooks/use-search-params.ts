import { useState, useEffect } from 'react';

function useSearchParams() {
    const [query, setQuery] = useState(
        new URLSearchParams(window.location.search),
    );

    useEffect(() => {
        const handleUrlChange = () => {
            setQuery(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('pushState', handleUrlChange);
        window.addEventListener('locationchange', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('pushState', handleUrlChange);
        };
    }, []);

    return query;
}

export default useSearchParams;
