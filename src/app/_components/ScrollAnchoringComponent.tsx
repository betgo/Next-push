import React, { useEffect, useRef } from "react";
import useScrollToBottom from "~/hooks/useScrollToBottom";

interface ScrollAnchoringComponentProps {
  children: React.ReactNode;
  onScroll: (scrollTop: number) => void;
}

const ScrollAnchoringComponent: React.FC<ScrollAnchoringComponentProps> = ({
  children,
  onScroll,
}) => {
  const { scrollRef, autoScroll } = useScrollToBottom("scroll");
  const containerRef = useRef<HTMLDivElement>(null);
  const previousBoundingRect = useRef<DOMRect>();
  const handlePageClick = () => {
    autoScroll.current = false;
  };
  const handleScroll = () => {
    autoScroll.current = false;
    if (scrollRef.current?.scrollTop) {
      onScroll(scrollRef.current?.scrollTop);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollRef.current;
    if (!container || !scrollContainer) return;

    let previousLastChild = container.lastElementChild;
    let previousScrollTop = scrollContainer.scrollTop;

    const scrollAdjustment = () => {
      if (!container || !scrollContainer) return;

      const currentBoundingRect = container.getBoundingClientRect();
      const isHeightIncreased = previousBoundingRect.current
        ? currentBoundingRect.height !== previousBoundingRect.current.height
        : false;
      const isAppend = container.lastElementChild !== previousLastChild;
      //   console.log(isHeightIncreased && !isAppend);
      if (isHeightIncreased && !isAppend && !autoScroll.current) {
        const newScrollYPosition =
          previousScrollTop +
          currentBoundingRect.height -
          (previousBoundingRect.current?.height ?? 0);
        scrollContainer.scrollTop = newScrollYPosition;
      }

      previousBoundingRect.current = currentBoundingRect;
      previousLastChild = container.lastElementChild;
      previousScrollTop = scrollContainer.scrollTop;
      requestAnimationFrame(scrollAdjustment);
    };

    const animationFrameId = requestAnimationFrame(scrollAdjustment);

    // Cleanup function to cancel the animation frame request
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="flex-1 overflow-auto"
      ref={scrollRef}
      onClick={handlePageClick}
      onScroll={handleScroll}
    >
      <div ref={containerRef}>{children}</div>
    </div>
  );
};

export default ScrollAnchoringComponent;
