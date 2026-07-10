import { useEffect } from 'react';


export const useVisitorTracker = () => {
    useEffect(() => {
        const trackVisit = async () => {
            const hasVisited = sessionStorage.getItem('portfolio_visited');

            if (!hasVisited) {
                try {
                    const res = await fetch('/api/analytics/track', {
                        method: 'POST'
                    });
                    if (res.ok) {
                        sessionStorage.setItem('portfolio_visited', 'true');
                    }
                } catch (err) {
                    console.error('Visitor tracking failed:', err);
                }
            }
        };

        trackVisit();
    }, []);
};
