import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect } from 'react';
type LoadMoreTriggerProps = {
  isLoading: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
} & IntersectionObserverInit;
function LoadMoreTrigger({ isLoading, hasMore, onLoadMore, threshold = 0, rootMargin = '0px' }: LoadMoreTriggerProps) {
  const [ref, entry] = useIntersectionObserver({
    threshold,
    rootMargin,
    root: null,
  });

  useEffect(() => {
    if (!hasMore) return;
    if (entry?.isIntersecting && !isLoading) {
      onLoadMore();
    }
  }, [entry?.isIntersecting, hasMore, isLoading, onLoadMore]);

  return <div ref={ref} />;
}

export default LoadMoreTrigger;
