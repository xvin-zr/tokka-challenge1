import { useState, useEffect } from 'react';

/**
 * Custom hook that returns the search parameters from the current URL and updates them when the URL changes.
 *
 * @returns The search parameters as a URLSearchParams object.
 */
function useSearchParams() {
    // Initialize the query state with the search parameters from the current URL
    const [query, setQuery] = useState(
        new URLSearchParams(window.location.search),
    );

    useEffect(() => {
        // Define a function to handle URL changes
        const handleUrlChange = () => {
            // Update the query state with the new search parameters from the updated URL
            setQuery(new URLSearchParams(window.location.search));
        };

        // Add event listeners for different URL change events
        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('pushState', handleUrlChange);
        window.addEventListener('locationchange', handleUrlChange);

        // Clean up the event listeners when the component unmounts
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('pushState', handleUrlChange);
            window.removeEventListener('locationchange', handleUrlChange);
        };
    }, []);

    // Return the query state, which represents the search parameters
    return query;
}

export default useSearchParams;
