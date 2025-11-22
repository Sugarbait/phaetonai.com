import { useEffect, useState, useRef } from 'react';

// Hook to detect when an element is visible in the viewport
export function useInView(options = { threshold: 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, stop observing
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return { ref, isVisible };
}

// Add scroll animation to sections
export function initScrollAnimations() {
  useEffect(() => {
    const animateSections = document.querySelectorAll('.section-animate');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateSections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      animateSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
}