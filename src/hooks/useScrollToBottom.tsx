import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type scrollType = {
  scrollRef: RefObject<HTMLDivElement>;
  autoScroll: MutableRefObject<boolean>;
  //   setAutoScroll: Dispatch<SetStateAction<boolean>>;
  scrollDomToBottom: () => void;
};

const cacheRecord = new Map<string, scrollType>();

// todo 平滑移动
function useScrollToBottom(key?: string) {
  // for auto-scroll
  let scrollRef = useRef<HTMLDivElement>(null);
  //   let [autoScroll, setAutoScroll] = useState(true);
  const autoScroll = useRef<boolean>(true);
  let result = {
    scrollRef,
    autoScroll,
    scrollDomToBottom,
  };
  if (key) {
    if (cacheRecord.has(key)) {
      result = cacheRecord.get(key)!;
      scrollRef = result.scrollRef;
    } else {
      cacheRecord.set(key, result);
    }
  }
  function scrollDomToBottom() {
    const dom = scrollRef.current;

    if (dom) {
      requestAnimationFrame(() => {
        result.autoScroll.current = true;
        dom.scrollTo(0, dom.scrollHeight);
      });
    }
  }

  // auto scroll
  useEffect(() => {
    if (result.autoScroll.current) {
      scrollDomToBottom();
    }
  });

  return result;
}

export default useScrollToBottom;
