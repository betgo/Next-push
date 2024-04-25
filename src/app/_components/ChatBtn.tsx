import React, { useRef, useState } from "react";

const ChatBtn = (props: {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState({
    full: 16,
    icon: 16,
  });

  function updateWidth() {
    if (!iconRef.current || !textRef.current) return;
    const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
    const textWidth = getWidth(textRef.current);
    const iconWidth = getWidth(iconRef.current);
    setWidth({
      full: textWidth + iconWidth,
      icon: iconWidth,
    });
  }

  return (
    <div
      className={
        "g-border animate-slide-in group box-content inline-flex h-4 w-[--icon-width] items-center overflow-hidden rounded-xl  px-2 py-1  transition-width hover:w-[--full-width] hover:delay-500 "
      }
      onClick={() => {
        props.onClick();
        setTimeout(updateWidth, 1);
      }}
      onMouseEnter={updateWidth}
      onTouchStart={updateWidth}
      style={
        {
          "--icon-width": `${width.icon}px`,
          "--full-width": `${width.full}px`,
        } as React.CSSProperties
      }
    >
      <div ref={iconRef} className="icon">
        {props.icon}
      </div>
      <div
        ref={textRef}
        className="group-hover: pointer-events-none -translate-x-[5px] whitespace-pre pl-1 opacity-0 transition-all  duration-300 group-hover:translate-x-0 group-hover:opacity-100  group-hover:delay-500"
      >
        {props.text}
      </div>
    </div>
  );
};

export default ChatBtn;
