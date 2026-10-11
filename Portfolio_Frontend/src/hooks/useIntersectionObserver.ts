import { useEffect, useRef, useCallback } from 'react';

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
    const elementsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Fallback for browsers without IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            elementsRef.current.forEach((el) => {
                if (el) el.classList.add('visible');
            });
            return;
        }

        const observerOptions: IntersectionObserverInit = {
            threshold: 0, // Triggers immediately when ANY pixel touches the viewport
            rootMargin: '100px 0px 100px 0px', // Pre-trigger before entering viewport for smooth scrolling
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elementsRef.current.forEach((el) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                    el.classList.add('visible');
                }
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const addToRefs = useCallback((el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
            if (typeof window !== 'undefined') {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                    el.classList.add('visible');
                }
            }
        }
    }, []);

    return { addToRefs };
};
