/**
 * Animation utilities for counters and metrics
 * Centralizes animation logic to avoid duplication across components
 */

/**
 * Animate a counter from 0 to target value
 * Used in HeroMetrics, Counter, and other metric displays
 * @param counter HTML element containing the counter
 * @param target Target number value (can be float)
 * @param duration Animation duration in milliseconds (default: 2000ms)
 */
export function animateCounter(
  counter: Element,
  target: number,
  duration: number = 2000
): void {
  const isFloat = target % 1 !== 0;
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = (): void => {
    current += increment;
    if (current < target) {
      counter.textContent = isFloat 
        ? current.toFixed(1) 
        : Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = isFloat 
        ? target.toFixed(1) 
        : target.toLocaleString();
    }
  };

  updateCounter();
}

/**
 * Animate all counters in a container
 * Selector should target elements with data-target attribute
 * @param containerSelector CSS selector for container
 * @param counterSelector CSS selector for individual counters
 */
export function animateAllCounters(
  containerSelector: string,
  counterSelector: string = '.animated-counter'
): void {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const counters = container.querySelectorAll(counterSelector);
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target') || '0');
    if (!isNaN(target)) {
      animateCounter(counter, target);
    }
  });
}

/**
 * Setup observer for animating counters when they come into view
 * More performant than animating all counters on page load
 */
export function setupCounterObserver(
  containerSelector: string,
  counterSelector: string = '.animated-counter'
): void {
  const container = document.querySelector(containerSelector);
  if (!container || !('IntersectionObserver' in window)) {
    // Fallback: animate immediately if IntersectionObserver not available
    animateAllCounters(containerSelector, counterSelector);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.textContent === '0') {
        const target = parseFloat(
          entry.target.getAttribute('data-target') || '0'
        );
        if (!isNaN(target)) {
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      }
    });
  });

  const counters = container.querySelectorAll(counterSelector);
  counters.forEach((counter) => observer.observe(counter));
}
